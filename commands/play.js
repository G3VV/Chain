//
// Copyright [2020] [Jakob de Guzman]
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

const { RichEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const search = require("yt-search");
const ytlist = require("youtube-playlist");

module.exports = {
  name: "play",
  aliases: ["p"],
  usage: "<query/url>",
  description: "Uses a YouTube link to play music.",
  needperms: ["SEND_MESSAGES", "CONNECT", "SPEAK"],
  permissions: [],
  execute(message, args, client) {
    const videoregex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const playlistregex = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/i;

    function formatnum(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? Math.floor((Math.abs(Number(labelValue)) / 1.0e9) * 100) / 100 + "B"
        : // Six Zeroes for Millions
        Math.abs(Number(labelValue)) >= 1.0e6
        ? Math.floor((Math.abs(Number(labelValue)) / 1.0e6) * 100) / 100 + "M"
        : // Three Zeroes for Thousands
        Math.abs(Number(labelValue)) >= 1.0e3
        ? Math.floor((Math.abs(Number(labelValue)) / 1.0e3) * 100) / 100 + "K"
        : Math.abs(Number(labelValue));
    }

    function play(connection, message) {
      message.guild.voiceConnection.voice.setSelfDeaf(true);

      var server = client.servers[message.guild.id];

      if (server.queue[0]) {
        var hours = Math.floor(server.queue[0].length_seconds / 3600);
        var minutes = Math.floor(
          server.queue[0].length_seconds / 60 - hours * 60
        );
        var seconds = Math.floor(
          server.queue[0].length_seconds - minutes * 60 - hours * 3600
        );

        const nowplaying = new RichEmbed()
          .setColor(client.other)
          .setTitle("Now Playing <a:vinyl:666908868277829642>")
          .addField("Title", `\`${server.queue[0].title}\``)
          .addField("Author", `\`${server.queue[0].author.name}\``)
          .addField(
            "Views",
            `\`${formatnum(
              parseInt(
                JSON.parse(JSON.stringify(server.queue[0], null, 2))
                  .player_response.videoDetails.viewCount
              )
            )}\``,
            true
          )
          .addField(
            "Video Length",
            `\`${hours}H:${minutes}M:${seconds}S\``,
            true
          )
          .addField("YouTube Link", server.queue[0].video_url)
          .setThumbnail(
            JSON.parse(JSON.stringify(server.queue[0], null, 2)).player_response
              .videoDetails.thumbnail.thumbnails[
              JSON.parse(JSON.stringify(server.queue[0], null, 2))
                .player_response.videoDetails.thumbnail.thumbnails.length - 1
            ].url
          )
          .setTimestamp(Date.now());
        message.channel.send(nowplaying);

        server.now = server.queue[0];

        server.playing = true;

        server.dispatcher = connection.playStream(
          ytdl(server.queue[0].video_url, { filter: "audioonly" })
        );

        server.dispatcher.setVolumeLogarithmic(server.volume / 100);

        server.dispatcher.on("end", function () {
          if (!server.loop) {
            server.queue.shift();
          }

          if (server.queue[0]) {
            play(connection, message);
          } else {
            server.now = undefined;
            server.volume = 100;
            server.playing = false;
            server.loop = false;
            server.queue = [];
            connection.disconnect();
          }
        });
      } else {
        server.queue.shift();

        if (server.queue.length >= 1) {
          play(connection, message);
        } else {
          server.now = undefined;
          server.volume = 100;
          server.playing = false;
          server.loop = false;
          server.queue = [];
          connection.disconnect();
        }
      }
    }

    if (!args[0]) {
      const embed = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Music")
        .setDescription("You need to provide a query!")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
      return;
    }

    if (!message.member.voiceChannel) {
      const embed = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Music")
        .setDescription("You must connect to a voice channel!")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
      return;
    }

    if (!client.servers[message.guild.id]) {
      client.servers[message.guild.id] = {
        queue: [],
        volume: 100,
        loop: false,
      };
    }

    message.channel.startTyping();

    if (!args[0].match(videoregex)) {
      if (!args[0].match(playlistregex)) {
        search(args.join(" "), function (_err, r) {
          const embed = new RichEmbed()
            .setColor(client.other)
            .setTitle("Music")
            .setDescription("Searching for `" + args.join(" ") + "`")
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(embed).then((searching) => {
            ytdl.getInfo(r.videos[0].url).then((vidinfo) => {
              var server = client.servers[message.guild.id];

              server.queue.push(vidinfo);

              if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then(function (connection) {
                  message.guild.voiceConnection.voice.setSelfDeaf(true);
                  play(connection, message);
                });
              }

              const embed = new RichEmbed()
                .setColor(client.success)
                .setTitle("Music")
                .setDescription("Added `" + vidinfo.title + "` to queue.")
                .setFooter(
                  `Executed by ${message.author.tag}`,
                  message.author.avatarURL
                )
                .setTimestamp(message.createdTimestamp);
              searching.edit(embed);
            });
          });
        });
      } else {
        var server = client.servers[message.guild.id];

        ytlist(args[0], "url").then((res) => {
          for (const vid of res.data.playlist) {
            ytdl.getInfo(vid, function (_err, vidinfo) {
              server.queue.push(vidinfo);

              if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then(function (connection) {
                  message.guild.voiceConnection.voice.setSelfDeaf(true);
                  play(connection, message);
                });
              }
            });
          }

          const embed = new RichEmbed()
            .setColor(client.success)
            .setTitle("Music")
            .setDescription(
              "Added `" + res.data.playlist.length + " videos` to queue."
            )
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(embed);
        });
      }
    } else {
      ytdl.getInfo(args[0], function (_err, vidinfo) {
        var server = client.servers[message.guild.id];

        server.queue.push(vidinfo);

        if (!message.guild.voiceConnection) {
          message.member.voiceChannel.join().then(function (connection) {
            message.guild.voiceConnection.voice.setSelfDeaf(true);
            play(connection, message);
          });
        }

        const embed = new RichEmbed()
          .setColor(client.success)
          .setTitle("Music")
          .setDescription("Added `" + vidinfo.title + "` to queue.")
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      });
    }

    message.channel.stopTyping();
  },
};

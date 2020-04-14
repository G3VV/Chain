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

module.exports = {
  name: "nowplaying",
  aliases: ["np", "playing", "song", "music"],
  usage: "",
  description: "Displays the current playing song.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
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

    var server = client.servers[message.guild.id];

    if (!server || !server.now) {
      const nowplaying = new RichEmbed()
        .setColor(client.other)
        .setTitle("Now Playing")
        .setDescription("There is currently no song playing.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(nowplaying);
    } else {
      var hours = Math.floor(server.now.length_seconds / 3600);
      var minutes = Math.floor(server.now.length_seconds / 60 - hours * 60);
      var seconds = Math.floor(
        server.now.length_seconds - minutes * 60 - hours * 3600
      );

      var proghours = Math.floor(server.dispatcher.time / 1000 / 3600);
      var progminutes = Math.floor(
        server.dispatcher.time / 1000 / 60 - proghours * 60
      );
      var progseconds = Math.floor(
        server.dispatcher.time / 1000 - progminutes * 60 - proghours * 3600
      );

      var prog = "";

      for (
        var i = 0;
        i <
        Math.floor(
          (server.dispatcher.time / 1000 / server.now.length_seconds) * 20 - 1
        );
        i++
      ) {
        prog += "═";
      }

      for (
        var i = 0;
        i <
        Math.ceil(
          20 -
            (server.dispatcher.time / 1000 / server.now.length_seconds) * 20 +
            1
        );
        i++
      ) {
        if (i === 0) {
          prog += "◯";
        } else {
          prog += "∙";
        }
      }

      const nowplaying = new RichEmbed()
        .setColor(client.other)
        .setTitle("Now Playing <a:vinyl:666908868277829642>")
        .addField("Title", `\`${server.now.title}\``)
        .addField("Author", `\`${server.now.author.name}\``)
        .addField(
          "Views",
          `\`${formatnum(
            parseInt(
              JSON.parse(JSON.stringify(server.now, null, 2)).player_response
                .videoDetails.viewCount
            )
          )}\``,
          true
        )
        .addField("Video Length", `\`${hours}H:${minutes}M:${seconds}S\``, true)
        .addField(
          "Video Progress:",
          `\`[${proghours}H:${progminutes}M:${progseconds}S] ${prog}\``
        )
        .addField("YouTube Link", server.now.video_url)
        .setThumbnail(
          JSON.parse(JSON.stringify(server.now, null, 2)).player_response
            .videoDetails.thumbnail.thumbnails[
            JSON.parse(JSON.stringify(server.now, null, 2)).player_response
              .videoDetails.thumbnail.thumbnails.length - 1
          ].url
        )
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(nowplaying);
    }
  }
};

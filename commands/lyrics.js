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
const fetch = require("node-fetch");

module.exports = {
  name: "lyrics",
  aliases: ["l", "words"],
  usage: "[query]",
  description: "Finds the requested lyrics.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    if (!args[0]) {
      var server = client.servers[message.guild.id];

      if (!server || !server.now) {
        const embed = new RichEmbed()
          .setColor(client.warning)
          .setTitle("Lyrics")
          .setDescription("Please provide a search query.")
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      } else {
        message.channel.startTyping();

        fetch(
          `https://api.ksoft.si/lyrics/search?q=${encodeURIComponent(
            server.now.title
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${require("../secret.json").ksoftapi}`,
            },
          }
        ).then((res) => {
          res.json().then((lyrics) => {
            if (lyrics.data[0].lyrics.length <= 3896) {
              const how_many_to_split_at = 1948;
              const song_parts = [];

              for (
                var i = 0, charsLength = lyrics.data[0].lyrics.length;
                i < charsLength;
                i += how_many_to_split_at
              ) {
                song_parts.push(
                  lyrics.data[0].lyrics.substring(i, i + how_many_to_split_at)
                );
              }

              song_parts.forEach((a) => {
                const embed = new RichEmbed()
                  .setColor(client.other)
                  .setAuthor(
                    "Lyrics provided by KSoft",
                    "https://cdn.ksoft.si/images/Logo128.png",
                    "https://api.ksoft.si/"
                  )
                  .setDescription(
                    `**${lyrics.data[0].name}**\n*${lyrics.data[0].artist}*\n\n${a}`
                  )
                  .setThumbnail(lyrics.data[0].album_art)
                  .setFooter(
                    `Executed by ${message.author.tag}`,
                    message.author.avatarURL
                  )
                  .setTimestamp(message.createdTimestamp);
                message.channel.send(embed);
              });
            } else {
              try {
                const how_many_to_split_at = 1948;
                const song_parts = [];

                for (
                  var i = 0, charsLength = lyrics.data[0].lyrics.length;
                  i < charsLength;
                  i += how_many_to_split_at
                ) {
                  song_parts.push(
                    lyrics.data[0].lyrics.substring(i, i + how_many_to_split_at)
                  );
                }

                song_parts.forEach((a) => {
                  const embed = new RichEmbed()
                    .setColor(client.other)
                    .setAuthor(
                      "Lyrics provided by KSoft",
                      "https://cdn.ksoft.si/images/Logo128.png",
                      "https://api.ksoft.si/"
                    )
                    .setDescription(
                      `**${lyrics.data[0].name}**\n*${lyrics.data[0].artist}*\n\n${a}`
                    )
                    .setThumbnail(lyrics.data[0].album_art)
                    .setFooter(
                      `Executed by ${message.author.tag}`,
                      message.author.avatarURL
                    )
                    .setTimestamp(message.createdTimestamp);
                  message.author.send(embed);
                });

                const notify = new RichEmbed()
                  .setColor(client.success)
                  .setDescription("Sent lyrics to DMs")
                  .setFooter(
                    `Executed by ${message.author.tag}`,
                    message.author.avatarURL
                  )
                  .setTimestamp(message.createdTimestamp);
                message.channel.send(notify);
              } catch (e) {
                const unable = new RichEmbed()
                  .setColor(client.warning)
                  .setDescription(
                    `Unable to send lyrics to DMs\n\n\`\`\`js\n${e}\n\`\`\``
                  )
                  .setFooter(
                    `Executed by ${message.author.tag}`,
                    message.author.avatarURL
                  )
                  .setTimestamp(message.createdTimestamp);
                message.channel.send(unable);
              }
            }
          });
        });

        message.channel.stopTyping();
      }
    } else {
      message.channel.startTyping();

      fetch(
        `https://api.ksoft.si/lyrics/search?q=${encodeURIComponent(
          args.join(" ")
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              require("../config.json").client.ksoftapi
            }`,
          },
        }
      ).then((res) => {
        res.json().then((lyrics) => {
          if (lyrics.data[0].lyrics.length <= 3896) {
            const how_many_to_split_at = 1948;
            const song_parts = [];

            for (
              var i = 0, charsLength = lyrics.data[0].lyrics.length;
              i < charsLength;
              i += how_many_to_split_at
            ) {
              song_parts.push(
                lyrics.data[0].lyrics.substring(i, i + how_many_to_split_at)
              );
            }

            song_parts.forEach((a) => {
              const embed = new RichEmbed()
                .setColor(client.other)
                .setAuthor(
                  "Lyrics provided by KSoft",
                  "https://cdn.ksoft.si/images/Logo128.png",
                  "https://api.ksoft.si/"
                )
                .setDescription(
                  `**${lyrics.data[0].name}**\n*${lyrics.data[0].artist}*\n\n${a}`
                )
                .setThumbnail(lyrics.data[0].album_art)
                .setFooter(
                  `Executed by ${message.author.tag}`,
                  message.author.avatarURL
                )
                .setTimestamp(message.createdTimestamp);
              message.channel.send(embed);
            });
          } else {
            try {
              const how_many_to_split_at = 1948;
              const song_parts = [];

              for (
                var i = 0, charsLength = lyrics.data[0].lyrics.length;
                i < charsLength;
                i += how_many_to_split_at
              ) {
                song_parts.push(
                  lyrics.data[0].lyrics.substring(i, i + how_many_to_split_at)
                );
              }

              song_parts.forEach((a) => {
                const embed = new RichEmbed()
                  .setColor(client.other)
                  .setAuthor(
                    "Lyrics provided by KSoft",
                    "https://cdn.ksoft.si/images/Logo128.png",
                    "https://api.ksoft.si/"
                  )
                  .setDescription(
                    `**${lyrics.data[0].name}**\n*${lyrics.data[0].artist}*\n\n${a}`
                  )
                  .setThumbnail(lyrics.data[0].album_art)
                  .setFooter(
                    `Executed by ${message.author.tag}`,
                    message.author.avatarURL
                  )
                  .setTimestamp(message.createdTimestamp);
                message.author.send(embed);
              });

              const notify = new RichEmbed()
                .setColor(client.success)
                .setDescription("Sent lyrics to DMs")
                .setFooter(
                  `Executed by ${message.author.tag}`,
                  message.author.avatarURL
                )
                .setTimestamp(message.createdTimestamp);
              message.channel.send(notify);
            } catch (e) {
              const unable = new RichEmbed()
                .setColor(client.warning)
                .setDescription(
                  `Unable to send lyrics to DMs\n\n\`\`\`js\n${e}\n\`\`\``
                )
                .setFooter(
                  `Executed by ${message.author.tag}`,
                  message.author.avatarURL
                )
                .setTimestamp(message.createdTimestamp);
              message.channel.send(unable);
            }
          }
        });
      });

      message.channel.stopTyping();
    }
  },
};

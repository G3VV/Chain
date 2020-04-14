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
  name: "volume",
  aliases: ["vol"],
  usage: "[volume]",
  description: "Changes the volume of the bot.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    var server = client.servers[message.guild.id];

    if (!server || !server.now) {
      const nowplaying = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Volume")
        .setDescription("There is currently no song playing.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(nowplaying);
    } else {
      if (!args[0]) {
        const nowplaying = new RichEmbed()
          .setColor(client.other)
          .setTitle("Volume")
          .setDescription("The current volume is " + server.volume + ".")
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(nowplaying);
      } else {
        if (parseInt(args[0]) === isNaN) {
          return;
        }

        if (parseInt(args[0]) > 9999) {
          server.volume = 9999;
          server.dispatcher.setVolumeLogarithmic(9999 / 100);

          const nowplaying = new RichEmbed()
            .setColor(client.success)
            .setTitle("Volume")
            .setDescription("Set volume to `9999`.")
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(nowplaying);

          return;
        }

        server.volume = parseInt(args[0]);
        server.dispatcher.setVolumeLogarithmic(parseInt(args[0]) / 100);

        const nowplaying = new RichEmbed()
          .setColor(client.success)
          .setTitle("Volume")
          .setDescription("Set volume to `" + server.volume + "`.")
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(nowplaying);
      }
    }
  },
};

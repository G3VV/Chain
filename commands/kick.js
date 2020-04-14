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
  name: "kick",
  aliases: [],
  usage: "<user> [reason]",
  description: "Kick's the specified member.",
  needperms: ["SEND_MESSAGES", "KICK_MEMBERS"],
  permissions: ["KICK_MEMBERS"],
  execute(message, args, client) {
    if (message.mentions.members.first()) {
      if (message.mentions.members.first().kickable) {
        message.mentions.members.first().kick();
        const embed = new RichEmbed()
          .setColor(client.success)
          .setTitle("Kick")
          .setDescription(
            "Kicked `" + message.mentions.members.first().tag + "` successfuly."
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      } else {
        const embed = new RichEmbed()
          .setColor(client.warning)
          .setTitle("Kick")
          .setDescription("You cannot kick this member.")
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      }
    } else {
      const embed = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Kick")
        .setDescription(
          "Unable to find this user.\n\nMake sure you mention them."
        )
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
    }
  },
};

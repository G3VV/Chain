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
  name: "help",
  aliases: ["h"],
  usage: "[command]",
  description: "Displays a list of dev commands for this bot.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    if (!args[0]) {
      const embed = new RichEmbed()
        .setColor(client.other)
        .setTitle("Help")
        .setDescription(
          "Commands:\n```asciidoc\n" +
            client.devcommands
              .map((m) => `== ${client.devprefix + m.name}\n${m.description}`)
              .join("\n") +
            "```"
        )
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.author
        .send(embed)
        .then(() => {
          const successembed = new RichEmbed()
            .setColor(client.success)
            .setTitle("Help")
            .setDescription("Sent dev command list to your messages.")
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(successembed);
        })
        .catch((e) => {
          const errorembed = new RichEmbed()
            .setColor(client.warning)
            .setTitle("Help")
            .setDescription("Unable to message you.")
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(errorembed);
        });
    } else {
      const checkcmd =
        client.devcommands.get(args[0].toLowerCase()) ||
        client.devcommands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase())
        );

      if (checkcmd) {
        const embed = new RichEmbed()
          .setColor(client.other)
          .setTitle(`Help | ${client.prefix}${checkcmd.name}`)
          .setDescription(`${checkcmd.description}`)
          .addField(
            "Usage:",
            `\`${checkcmd.usage ? checkcmd.usage : "None"}\``,
            true
          )
          .addField(
            "Aliases:",
            `\`${
              checkcmd.aliases.join(", ") ? checkcmd.aliases.join(", ") : "None"
            }\``,
            true
          )
          .addField(
            "Required Permissions:",
            `\`${
              checkcmd.permissions.join(", ")
                ? checkcmd.permissions.join(", ")
                : "None"
            }\``,
            true
          )
          .addField(
            "My Permissions:",
            `\`${
              checkcmd.needperms.join(", ")
                ? checkcmd.needperms.join(", ")
                : "None"
            }\``,
            true
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
          .setTitle("Help")
          .setDescription(
            "Unable to find command `" +
              client.devprefix +
              args[0].toLowerCase() +
              "`."
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      }
    }
  },
};

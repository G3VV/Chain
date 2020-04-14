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
  name: "nick",
  aliases: ["nickname", "name"],
  usage: "[nickname]",
  description: "Sets nickname to specified nick. Leave blank to reset",
  needperms: ["SEND_MESSAGES", "MANAGE_NICKNAMES"],
  permissions: ["CHANGE_NICKNAME"],
  execute(message, args, client) {
    if (!args[0]) {
      message.member
        .setNickname("")
        .then(() => {
          const embed = new RichEmbed()
            .setColor(client.success)
            .setTitle("Set Nickname")
            .setDescription("Successfully reset nickname.")
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(embed);
        })
        .catch(e => {
          const embed = new RichEmbed()
            .setColor(client.warning)
            .setTitle("Error")
            .setDescription("Unable to set nickname.\n\n```js" + e + "```")
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(embed);
        });

      return;
    }

    message.member
      .setNickname(args.join(" "))
      .then(() => {
        const embed = new RichEmbed()
          .setColor(client.success)
          .setTitle("Set Nickname")
          .setDescription(
            "Successfully set nickname to `" + args.join(" ") + "`"
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      })
      .catch(e => {
        const embed = new RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription("Unable to set nickname.\n\n```js" + e + "```")
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      });
  }
};

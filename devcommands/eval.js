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

const { inspect } = require("util");
const { post } = require("snekfetch");
const { RichEmbed } = require("discord.js");

module.exports = {
  name: "eval",
  aliases: ["e", "code", "exe", "execute"],
  usage: "<javascript code>",
  description: "Evaluates javascript code.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    if (!args[0]) {
      var embed = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Eval")
        .setDescription("You need to enter javascript code to evaluate!")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
      return;
    }

    message.channel.startTyping();

    var embed = new RichEmbed()
      .setColor(client.other)
      .setTitle("Eval")
      .setDescription("Working on it...")
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);

    message.channel.send(embed).then(async msg => {
      try {
        const code = await eval(args.join(" ")); // Store the eval code to a variable
        const inspected = await inspect(code); // inspect the code eval output

        if (inspected.toString().length < 1900 - message.content.length) {
          embed = new RichEmbed()
            .setColor(client.success)
            .setTitle("Eval")
            .setDescription(
              `\`\`\`js\n${args.join(
                " "
              )}\n\`\`\`\n\n\`\`\`js\n${inspected}\n\`\`\``
            )
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          msg.edit(embed);
        } else {
          await post("https://hastebin.com/documents")
            .send(inspected.toString())
            .then(response => {
              embed = new RichEmbed()
                .setColor(client.success)
                .setTitle("Eval")
                .setDescription(
                  `\`\`\`js\n${args.join(" ")}\`\`\`\n\nhttps://hastebin.com/${
                    response.body.key
                  }`
                )
                .setFooter(
                  `Executed by ${message.author.tag}`,
                  message.author.avatarURL
                )
                .setTimestamp(message.createdTimestamp);

              msg.edit(embed);
            })
            .catch(_err => {
              embed = new RichEmbed()
                .setColor(client.warning)
                .setTitle("Eval")
                .setDescription(
                  `:warning: Hastebin is down [0-1800] \`\`\`js\n${inspected
                    .toString()
                    .substring(0, 1800)}\`\`\``
                )
                .setFooter(
                  `Executed by ${message.author.tag}`,
                  message.author.avatarURL
                )
                .setTimestamp(message.createdTimestamp);
              return msg.edit(embed);
            });
        }
      } catch (e) {
        embed = new RichEmbed()
          .setColor(client.warning)
          .setTitle("Eval")
          .setDescription(
            `There was an error with eval.\n\n:x: Error: \`\`\`js\n${e}\`\`\``
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        msg.edit(embed);
      }
    });

    message.channel.stopTyping();
  }
};

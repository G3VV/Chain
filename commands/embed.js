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
  name: "embed",
  aliases: ["embeds", "bc", "broadcast", "say", "announce"],
  usage: "[message]",
  description: "Echo's back the message in an embed.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    if (!args[0]) {
      const embed = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Error")
        .setDescription("Please add a message.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
      return;
    }

    const embed = new RichEmbed()
      .setColor(client.other)
      .setDescription(args.join(" "))
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed);
  }
};

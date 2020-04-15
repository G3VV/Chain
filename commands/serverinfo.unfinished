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
  name: "serverinfo",
  aliases: ["guild", "server", "guildinfo"],
  usage: "",
  description: "Bring's up info on the current guild.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    client.fetchUser(message.guild.ownerID).then((owner) => {
      const embed = new RichEmbed()
        .setTitle(message.guild.name)
        .addField("Guild Name:", `\`${message.guild.name}\``, true)
        .addField("Guild ID:", `\`${message.guild.id}\``, true)
        .addField(
          "Owner:",
          `\`${owner.username}#${owner.discriminator}\``,
          true
        )
        .addField("Members:", `\`${message.guild.memberCount}\``, true)
        .addField("Created At:", `\`${message.guild.createdAt}\``, true)
        .addField(
          "Emojis",
          `${message.guild.emojis.map((m) => `${m}`).join("")}`
        )
        .setColor(client.other)
        .setTimestamp(Date.now())
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        );

      message.channel.send(embed);
    });
  },
};

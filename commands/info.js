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
  name: "info",
  aliases: ["inf", "i"],
  usage: "",
  description: "Displays current info about the bot.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    const embed = new RichEmbed()
      .setColor(client.other)
      .setTitle("Bot Info")
      .setDescription(
        "Created by: `" +
          client.users.get("445035187370328066").username +
          "#" +
          client.users.get("445035187370328066").discriminator +
          "`\n\nContributors:\n`" +
          client.guilds
            .get("572993536304087065")
            .roles.get("647163176831680523")
            .members.map((m) => m.user.tag)
            .join(", ") +
          "`"
      )
      .addField("Version:", `\`v${client.version}\``, true)
      .addField("Prefix:", `\`${client.prefix}\``, true)
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed);
  },
};

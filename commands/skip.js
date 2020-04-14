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
  name: "skip",
  aliases: ["next", "s"],
  usage: "",
  description: "Skips the current song playing.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    var server = client.servers[message.guild.id];

    if (!server) {
      const embed = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Music")
        .setDescription("There is no songs in the queue.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);

      return;
    }

    if (server.dispatcher) {
      server.dispatcher.end();
      const embed = new RichEmbed()
        .setColor(client.success)
        .setTitle("Music")
        .setDescription("Skipped to next song in queue.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
    } else {
      const embed = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Music")
        .setDescription("There is no songs in the queue.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
    }
  }
};

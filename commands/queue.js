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
  name: "queue",
  aliases: ["songs", "q"],
  usage: "",
  description: "Displays the current song queue.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    var server = client.servers[message.guild.id];

    const embed = new RichEmbed();

    if (!server) {
      embed
        .setDescription("No songs in queue")
        .setColor(client.other)
        .setTitle("Song Queue")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
      return;
    }

    var desctitle = "```";

    if (server.queue[0]) {
      desctitle += `\nNow Playing: ${server.queue[0].title}\n`;
    }

    if (server.queue.length <= 10) {
      for (var i = 0; i < server.queue.length - 1; i++) {
        desctitle += "\n#" + (i + 1) + " " + server.queue[i + 1].title;
      }
    } else {
      for (var i = 0; i < 9; i++) {
        desctitle += "\n#" + (i + 1) + " " + server.queue[i + 1].title;
      }

      desctitle += `\n\n... and ${server.queue.length - 9} more.`;
    }

    desctitle += "\n```";

    if (desctitle === "```\n```") {
      embed.setDescription("No songs in queue");
    } else {
      embed.setDescription(desctitle);
    }

    embed
      .setColor(client.other)
      .setTitle("Song Queue")
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed);
  },
};

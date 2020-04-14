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
  name: "stop",
  aliases: ["disconnect"],
  usage: "",
  description: "Stops the current song playing and disconnects the bot.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    var server = client.servers[message.guild.id];

    if (message.guild.voiceConnection) {
      server.queue = [];

      if (server.dispatcher) {
        server.dispatcher.end();
      }

      server.now = {};

      const embed = new RichEmbed()
        .setColor(client.success)
        .setTitle("Music")
        .setDescription("Disconnected from voice channel.")
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
        .setDescription("I am not connected to a voice channel.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
    }

    if (message.guild.connection) {
      message.guild.voiceConnection.disconnect();
    }
  }
};

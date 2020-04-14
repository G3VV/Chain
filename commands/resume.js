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
  name: "resume",
  aliases: ["re"],
  usage: "",
  description: "Resumes paused music.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    var server = client.servers[message.guild.id];

    if (!server || !server.now) {
      const nowplaying = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Music")
        .setDescription("There is currently no song playing.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(nowplaying);

      return;
    }

    if (server.playing) {
      const nowplaying = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Music")
        .setDescription("The music is already playing.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(nowplaying);

      return;
    }

    server.dispatcher.resume();

    server.playing = true;

    const nowplaying = new RichEmbed()
      .setColor(client.success)
      .setTitle("Music")
      .setDescription("Successfuly resumed the music.")
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(nowplaying);
  }
};

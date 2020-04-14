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
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  name: "reset",
  aliases: ["restart", "r", "reload", "refresh", "load"],
  usage: "",
  description: "Reloads all commands.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));
    const devFiles = fs
      .readdirSync("./devcommands")
      .filter((file) => file.endsWith(".js"));

    console.log("Reloading Commands.");

    const embed = new RichEmbed()
      .setColor(client.other)
      .setTitle("Reload")
      .setDescription("Reloading Commands...")
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed).then((messageinfo) => {
      client.commands = new Discord.Collection();
      client.devcommands = new Discord.Collection();

      for (const file of commandFiles) {
        delete require.cache[require.resolve(`../commands/${file}`)];
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
        console.log(`Loaded ../commands/${file}`);
      }

      for (const file of devFiles) {
        delete require.cache[require.resolve(`../devcommands/${file}`)];
        const command = require(`../devcommands/${file}`);
        client.devcommands.set(command.name, command);
        console.log(`Loaded ../devcommands/${file}`);
      }
      console.log("Reloaded Commands.");

      const newembed = new RichEmbed()
        .setColor(client.success)
        .setTitle("Reload")
        .setDescription("Reloaded Commands.")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      messageinfo.edit(newembed);
    });
  },
};

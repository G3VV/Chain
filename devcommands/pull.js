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
const git = require("simple-git/promise");
const cp = require("child_process");

module.exports = {
  name: "pull",
  aliases: ["p", "update", "sync"],
  usage: "",
  description: "Pulls any new files from the git.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  async execute(message, args, client) {

    const embed = new RichEmbed()
      .setColor(client.other)
      .setTitle("Pull")
      .setDescription("Pulling changes from GitHub...")
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    await message.channel.send(embed).then(messageinfo => {

    await cp.exec(
      `git pull ${require("../package.json").repository.url.split("+")[1]}`,
      { cwd: __dirname },
      async (error, stdout, stderr) => {
        const newembed = new RichEmbed()
        .setColor(client.other)
        .setTitle("Pull")
        .setDescription("Result:\n```" + stdout + "```")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      await messageinfo.edit(newembed);
      }
    );
    });
  },
};

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

const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");

module.exports = {
  name: "wikihow",
  aliases: ["wiki", "howto"],
  usage: "",
  description: "Grabs a random Wikihow article.",
  needperms: ["SEND_MESSAGES"],
  permissions: [],
  execute(message, args, client) {
    fetch("https://api.ksoft.si/images/random-wikihow?nsfw=false", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${require("../secret.json").ksoftapi}`
      }
    }).then(res => {
      res.json().then(memestuff => {
        const embed = new RichEmbed()
          .setTitle(memestuff.title)
          .setAuthor(
            "Wikihow provided by KSoft",
            "https://cdn.ksoft.si/images/Logo128.png",
            "https://api.ksoft.si/"
          )
          .setDescription(`[**Article Link**](${memestuff.article_url})`)
          .setImage(memestuff.url)
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setColor(client.other)
          .setTimestamp(message.createdTimestamp);

        message.channel.send(embed);
      });
    });
  }
};

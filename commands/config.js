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
  name: "config",
  aliases: ["conf", "settings", "options", "option", "configure"],
  usage: "[<setting> <value>]",
  description: "Congiure the bot's settings for the current guild.",
  needperms: ["SEND_MESSAGES"],
  permissions: ["MANAGE_GUILD"],
  execute(message, args, client) {
    const embed = new RichEmbed()
      .setColor(client.other)
      .setTitle("Important Links")
      .setDescription(
        "**Permanant Discord Invite:** https://discord.gg/ft3vEZU\n**Invite Bot Link:** http://bit.ly/InviteChain\n**Top.gg Vote Link:** https://top.gg/bot/645824637338386433/vote\n**Website:** https://proximitynow.gitbook.io/chain"
      )
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed);
  },
};

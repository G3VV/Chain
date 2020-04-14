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
  name: "endgiveaway",
  aliases: ["giveprize", "endga", "ega"],
  usage: "<message id>",
  description: "Finishes a giveaway and select a random member.",
  needperms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"],
  permissions: ["MANAGE_MESSAGES"],
  execute(message, args, client) {
    if (!args[0]) {
      const embed = new RichEmbed()
        .setColor(client.warning)
        .setTitle("Error")
        .setDescription("Please provide a message ID")
        .setFooter(
          `Executed by ${message.author.tag}`,
          message.author.avatarURL
        )
        .setTimestamp(message.createdTimestamp);
      message.channel.send(embed);
      return;
    }

    message.channel.fetchMessage(args[0]).then(() => {
      const giveawaymessage = message.channel.messages.get(args[0]);

      if (!giveawaymessage) {
        const embed = new RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription("Invalid giveaway.")
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
        return;
      }

      if (giveawaymessage.author.id !== client.user.id) {
        const embed = new RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription("Invalid giveaway.")
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      } else {
        if (giveawaymessage.content === "") {
          if (giveawaymessage.embeds[0].title === "Giveaway") {
            giveawaymessage.reactions
              .first()
              .fetchUsers()
              .then((users) => {
                users = users.filter((n) => !n.bot);
                const randomnumber = Math.round(
                  Math.random() * (users.size - 1)
                );
                const winner = users.map((m) => m)[randomnumber];
                const embed = new RichEmbed()
                  .setColor(client.other)
                  .setTitle("Giveaway Ended")
                  .addField(
                    "Winner:",
                    `\`${winner.username}#${winner.discriminator}\``,
                    true
                  )
                  .addField(
                    "Chance:",
                    `\`${Math.round((1 / users.size) * 100 * 100) / 100}%\``,
                    true
                  )
                  .addField(
                    "User Number:",
                    `\`#${randomnumber + 1} out of ${users.size} people.\``
                  )
                  .addField("Prize:", giveawaymessage.embeds[0].fields[0].value)
                  .setThumbnail(winner.avatarURL)
                  .setFooter(
                    `Executed by ${message.author.tag}`,
                    message.author.avatarURL
                  )
                  .setTimestamp(message.createdTimestamp);
                giveawaymessage.edit(embed);
                giveawaymessage
                  .clearReactions()
                  .catch((error) =>
                    console.error("Failed to clear reactions: ", error)
                  );
                message.delete();
              });
          } else {
            const embed = new RichEmbed()
              .setColor(client.warning)
              .setTitle("Error")
              .setDescription("Invalid giveaway.")
              .setFooter(
                `Executed by ${message.author.tag}`,
                message.author.avatarURL
              )
              .setTimestamp(message.createdTimestamp);
            message.channel.send(embed);
          }
        } else {
          const embed = new RichEmbed()
            .setColor(client.warning)
            .setTitle("Error")
            .setDescription("Invalid giveaway.")
            .setFooter(
              `Executed by ${message.author.tag}`,
              message.author.avatarURL
            )
            .setTimestamp(message.createdTimestamp);
          message.channel.send(embed);
        }
      }
    });
  },
};

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

// console.log(client.commands.map(m=>`- **${m.name.charAt(0).toUpperCase() + m.name.substr(1)}**: ${m.description}\n - **Usage**: \`${client.prefix + m.name}${m.usage ? " " + m.usage : ""}\`\n - **Required Permission(s)**: \`${m.permissions.join(', ') ? m.permissions.join(', ') : "None"}\`\n - **Bot Permissions**: \`${m.needperms.join(', ') ? m.needperms.join(', ') : "None"}\``).join('\n'))

const fs = require("fs");
const Discord = require("discord.js");
const similarstring = require("string-similarity");
const config = require("./config.json");
const client = new Discord.Client();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
const devFiles = fs
  .readdirSync("./devcommands")
  .filter((file) => file.endsWith(".js"));
//const DBL = require("dblapi.js");
//const dbl = new DBL(require("./secret.json").dbltoken, client);
const humanizeDuration = require("humanize-duration");

//dbl.on("posted", () => {
  //console.log("Server count posted!");
//});

//dbl.on("error", (e) => {
  //console.log(`Oops! ${e}`);
//});

client.on("ready", () => {
  client.commands = new Discord.Collection();
  client.devcommands = new Discord.Collection();

  for (const file of commandFiles) {
    delete require.cache[require.resolve(`./commands/${file}`)];
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Loaded ./commands/${file}`);
  }

  for (const file of devFiles) {
    delete require.cache[require.resolve(`./devcommands/${file}`)];
    const command = require(`./devcommands/${file}`);
    client.devcommands.set(command.name, command);
    console.log(`Loaded ./devcommands/${file}`);
  }

  client.colors = config.colors;
  client.success = client.colors.client.success;
  client.warning = client.colors.client.warn;
  client.other = client.colors.client.otherchain;
  client.gold = client.colors.client.gold;
  client.prefix = config.client.prefix;
  client.devprefix = config.client.devprefix;
  client.version = config.client.version;

  client.servers = {};

  console.log("Bot ready!");
  client.user.setStatus("available");

  const embed = new Discord.RichEmbed()
    .setColor(client.success)
    .setTitle("Status")
    .setDescription(
      "<:online:665406288246603806> **Chain Online**\n\nWe are now back online. Thanks for your patience! 👍",
      String.fromCharCode(8203)
    )
    .setTimestamp(Date.now());

  client.channels.get("665390185311240193").send(embed);

  const embed2 = new Discord.RichEmbed()
    .setColor(client.other)
    .setTitle("Status")
    .setDescription("Bot online.")
    .setTimestamp(Date.now());

  client.channels.get("665390784165576714").send(embed2);

  client.user.setActivity(`v${client.version} | ${client.prefix}help`, {
    type: "PLAYING",
  });
  let status = 1;

  dbl.getVotes().then((votes) => {
    const something = [];
    for (var i = 0; i < 10; i++) {
      if (!votes[i]) break;

      something.push(
        `${(i + 1).toString()}. ${
          (client.users.get(votes[i].id) || { tag: "Unknown User" }).tag
        }`
      );
    }
    const votelist = new Discord.RichEmbed()
      .setColor(client.gold)
      .setTitle("Last 10 Votes")
      .setAuthor(
        "Vote for Chain on top.gg!",
        "",
        "https://top.gg/bot/645824637338386433/vote"
      )
      .setDescription(something)
      .setThumbnail("https://top.gg/images/dblnew.png")
      .setTimestamp(Date.now());
    client.channels
      .get("665390225534746638")
      .fetchMessages(1)
      .then((messages) => {
        messages.first().edit(votelist);
      });
  });

  const statsembed = new Discord.RichEmbed()
    .setColor(client.other)
    .setTitle("Chain Stats")
    .addField("Total Commands", `\`${client.commands.size}\``, true)
    .addField("Total Guilds", `\`${client.guilds.size}\``, true)
    .addField("Total Channels", `\`${client.channels.size}\``, true)
    .addField("Total Users", `\`${client.users.size}\``, true)
    .addField(
      "Voice Connections",
      `\`${client.guilds.filter((n) => n.voiceConnection).size}\``,
      true
    )
    .addField(
      "Uptime",
      `\`${humanizeDuration(client.uptime, {
        conjunction: " and ",
        serialComma: false,
        language: "en",
        units: ["d", "h", "m", "s"],
        round: true,
      })}\``
    )
    .setThumbnail(client.user.avatarURL)
    .setTimestamp(Date.now());
  client.channels
    .get("665390261031010344")
    .fetchMessages(1)
    .then((messages) => {
      messages.first().edit(statsembed);
    });

  client.guilds
    .get("572993536304087065")
    .channels.get("666168177230610432")
    .fetchMessage("666168969064873984");

  client.guilds
    .get("572993536304087065")
    .channels.get("666423585396490251")
    .fetchMessages(1)
    .then((me) => {
      client.guilds
        .get("572993536304087065")
        .channels.get("666423585396490251")
        .setTopic(
          `Count up to infinity. Current number [${
            me.first().content
          }]. Special roles every 1K, 10K and 100K.`
        );
    });

  setInterval(() => {
    dbl.getVotes().then((votes) => {
      const something = [];
      for (var i = 0; i < 10; i++) {
        if (!votes[i]) break;

        something.push(
          `${(i + 1).toString()}. ${votes[i].username}#${
            votes[i].discriminator
          }`
        );
      }
      const votelist = new Discord.RichEmbed()
        .setColor(client.gold)
        .setTitle("Last 10 Votes")
        .setAuthor(
          "Vote for Chain on top.gg!",
          "",
          "https://top.gg/bot/645824637338386433/vote"
        )
        .setDescription(something)
        .setThumbnail("https://top.gg/images/dblnew.png")
        .setTimestamp(Date.now());
      client.channels
        .get("665390225534746638")
        .fetchMessages(1)
        .then((messages) => {
          messages.first().edit(votelist);
        });
    });

    const statsembed = new Discord.RichEmbed()
      .setColor(client.other)
      .setTitle("Chain Stats")
      .addField("Total Commands", `\`${client.commands.size}\``, true)
      .addField("Total Guilds", `\`${client.guilds.size}\``, true)
      .addField("Total Channels", `\`${client.channels.size}\``, true)
      .addField("Total Users", `\`${client.users.size}\``, true)
      .addField(
        "Voice Connections",
        `\`${client.guilds.filter((n) => n.voiceConnection).size}\``,
        true
      )
      .addField(
        "Uptime",
        `\`${humanizeDuration(client.uptime, {
          conjunction: " and ",
          serialComma: false,
          language: "en",
          units: ["d", "h", "m", "s"],
          round: true,
        })}\``
      )
      .setThumbnail(client.user.avatarURL)
      .setTimestamp(Date.now());
    client.channels
      .get("665390261031010344")
      .fetchMessages(1)
      .then((messages) => {
        messages.first().edit(statsembed);
      });

    if (status === 2) status = 0;
    if (status === 0) {
      client.user.setActivity(
        `over ${client.guilds.size} guilds | ${client.prefix}help`,
        { type: "WATCHING" }
      );
    } else {
      client.user.setActivity(`v${client.version} | ${client.prefix}help`, {
        type: "PLAYING",
      });
    }

    status++;

    client.guilds
      .get("572993536304087065")
      .channels.get("666423585396490251")
      .fetchMessages(1)
      .then((me) => {
        if (me.editedAt) {
          me.delete();
        } else {
          client.guilds
            .get("572993536304087065")
            .channels.get("666423585396490251")
            .setTopic(
              `Count up to infinity. Current number [${
                me.first().content
              }]. Special roles every 1K, 10K and 100K.`
            );
        }
      });

    client.guilds
      .filter((n) => n.voiceConnection)
      .map((m) => {
        if (
          m.voiceConnection.channel.members.filter((n) => !n.user.bot).size <= 0
        ) {
          const server = client.servers[m.id];

          server.now = undefined;
          server.volume = 100;
          server.playing = false;
          server.loop = false;
          server.queue = [];
          m.voiceConnection.disconnect();
        }
      });
  }, 30000);
});

client.on("guildCreate", (guild) => {
  const embed = new Discord.RichEmbed()
    .setColor(client.other)
    .setTitle("New Guild")
    .setDescription("Chain has been added to `" + guild.name + "`")
    .setThumbnail(guild.iconURL)
    .setTimestamp(Date.now());

  client.channels.get("665390784165576714").send(embed);

  const embed2 = new Discord.RichEmbed()
    .setColor(client.gold)
    .setTitle("Chain")
    .setDescription(
      "Thank you for choosing **Chain**! The bot is ready to use from invite, so to get commands do `%help`!\n\n__**Support Server:**__ https://discord.gg/ft3vEZU\n\n- Chain Bot Developers <:kappa:665407289062326293>"
    )
    .setTimestamp(Date.now());
  guild.members.get(guild.ownerID).send(embed2);
});

client.on("message", (message) => {
  if (message.channel.id === "666423585396490251") {
    if (parseInt(message.content) === isNaN) {
      console.log("nan");
      message.delete();
      return;
    }

    message.channel.fetchMessages(2).then((m) => {
      const me = Array.from(m)[1][1];

      if (me.editedAt) {
        me.delete();
        message.delete();
        return;
      }

      if (
        Number(message.content) !== parseInt(me.content) + 1 ||
        !(message.content % 1 === 0) ||
        message.content.includes(".")
      ) {
        message.delete();
        return;
      }

      if (message.content.includes("69") || message.content.includes("420")) {
        message.react("🇱").then(() => {
          message.react("🇲").then(() => {
            message.react("🇦").then(() => {
              message.react("🇴");
            });
          });
        });
      }

      if (parseInt(message.content) % 100000 === 0) {
        message.member.addRole("666429954522611776");
        message.react("⭐");
        message.pin();
      } else {
        if (parseInt(message.content) % 10000 === 0) {
          message.member.addRole("666429870477148162");
          message.react("⭐");
          message.pin();
        } else {
          if (parseInt(message.content) % 1000 === 0) {
            message.member.addRole("666429366049308682");
            message.react("⭐");
            message.pin();
          }
        }
      }
    });
  }

  if (message.channel.id === "665730536957804544") {
    message
      .react("665773004612960287")
      .then(() => {
        message.react("665773004399050761").catch("");
      })
      .catch("");

    return;
  }

  if (message.channel.id === "588606307301588994") {
    message.guild
      .createChannel(`${message.author.username}-support`, "text", [
        { id: "572993536304087065", deny: ["VIEW_CHANNEL"] },
        { id: message.author.id, allow: ["VIEW_CHANNEL"] },
        { id: "665688937162866708", allow: ["VIEW_CHANNEL"] },
      ])
      .then((channel) => {
        channel.setParent("588605640029765662");

        channel.send("<@&665688937162866708>").then((m) => m.delete());

        const supportembed = new Discord.RichEmbed()
          .setTitle("Support")
          .setDescription(
            `Please wait while a staff member helps you with your problem. If the problem has been resolved end the session by typing \`${client.prefix}close\`\n\n\`${message.content}\``
          )
          .setColor(client.other)
          .setTimestamp(Date.now());

        channel.send(supportembed);

        message.delete();
      })
      .catch(console.error);
  }

  if (message.channel.name) {
    if (message.channel.name.includes("-support")) {
      if (message.content.toLowerCase() === `${client.prefix}close`) {
        message.channel.delete();
        return;
      }
    }
  }

  if (
    message.content === "<@!645824637338386433>" &&
    message.channel.type == "text"
  ) {
    if (
      message.guild.members.get(client.user.id).hasPermission("SEND_MESSAGES")
    ) {
      if (
        !message.member.hasPermission(client.commands.get("info").permissions)
      ) {
        const embed = new Discord.RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription(
            `You do not have all the required permission(s) for this command. You also need the following permission(s):\n\n\`\`\`${client.commands
              .get("info")
              .permissions.filter((n) => !message.member.hasPermission(n))
              .join(", ")}\`\`\``
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
        return;
      }

      if (
        !message.guild.members
          .get(client.user.id)
          .hasPermission(client.commands.get("info").needperms)
      ) {
        const embed = new Discord.RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription(
            `I do not have the required permission(s) for this command. I also need the following permission(s):\n\n\`\`\`${client.commands
              .get("info")
              .needperms.filter(
                (n) =>
                  !message.guild.members.get(client.user.id).hasPermission(n)
              )
              .join(", ")}\`\`\``
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
        return;
      }

      try {
        client.commands.get("info").execute(message, undefined, client);
      } catch (error) {
        console.error(error);
        const embed = new Discord.RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription(
            `There was an error trying to execute that command.\n\n\`\`\`js\n${error}\`\`\``
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
      }
      return;
    }
  }

  if (
    message.channel.type === "text" &&
    message.content.startsWith(client.devprefix) &&
    !message.author.bot &&
    client.guilds.get("572993536304087065").members.get(message.author.id) &&
    message.guild.members.get(client.user.id).hasPermission("SEND_MESSAGES")
  ) {
    if (
      client.guilds
        .get("572993536304087065")
        .members.get(message.author.id)
        .roles.has("647163176831680523")
    ) {
      const args = message.content.slice(client.devprefix.length).split(/ +/);
      const command = args.shift().toLowerCase();
      const checkcmd =
        client.devcommands.get(command) ||
        client.devcommands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(command)
        );

      if (!checkcmd) {
        if (message.guild.id === "264445053596991498") return;

        const embed = new Discord.RichEmbed()
          .setColor(client.warning)
          .setTitle("Unknown Command")
          .setDescription(
            `Did you mean \`${
              client.devprefix +
              similarstring.findBestMatch(
                command,
                client.devcommands.map((m) => m.name)
              ).bestMatch.target
            }\`?\n\nUse \`${client.devprefix}help\` for a list of dev commands.`
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
        return;
      }

      if (!message.member.hasPermission(checkcmd.permissions)) {
        const embed = new Discord.RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription(
            `You do not have all the required permission(s) for this command. You also need the following permission(s):\n\n\`\`\`${checkcmd.permissions
              .filter((n) => !message.member.hasPermission(n))
              .join(", ")}\`\`\``
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
        return;
      }

      if (
        !message.guild.members
          .get(client.user.id)
          .hasPermission(checkcmd.needperms)
      ) {
        const embed = new Discord.RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription(
            `I do not have the required permission(s) for this command. I also need the following permission(s):\n\n\`\`\`${checkcmd.needperms
              .filter(
                (n) =>
                  !message.guild.members.get(client.user.id).hasPermission(n)
              )
              .join(", ")}\`\`\``
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
        return;
      }

      try {
        checkcmd.execute(message, args, client);
      } catch (error) {
        console.error(error);
        const embed = new Discord.RichEmbed()
          .setColor(client.warning)
          .setTitle("Error")
          .setDescription(
            `There was an error trying to execute that command.\n\n\`\`\`js\n${error}\`\`\``
          )
          .setFooter(
            `Executed by ${message.author.tag}`,
            message.author.avatarURL
          )
          .setTimestamp(message.createdTimestamp);
        message.channel.send(embed);
        return;
      }
      return;
    }
  }

  if (
    !message.content.startsWith(client.prefix) ||
    message.author.bot ||
    message.channel.type !== "text" ||
    !message.guild.members.get(client.user.id).hasPermission("SEND_MESSAGES")
  )
    return;

  const args = message.content.slice(client.prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const checkcmd =
    client.commands.get(command) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

  if (!checkcmd) {
    if (message.guild.id === "264445053596991498") return;

    const embed = new Discord.RichEmbed()
      .setColor(client.warning)
      .setTitle("Unknown Command")
      .setDescription(
        `Did you mean \`${
          client.prefix +
          similarstring.findBestMatch(
            command,
            client.commands.map((m) => m.name)
          ).bestMatch.target
        }\`?\n\nUse \`${client.prefix}help\` for a list of commands.`
      )
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed);
    return;
  }

  if (!message.member.hasPermission(checkcmd.permissions)) {
    const embed = new Discord.RichEmbed()
      .setColor(client.warning)
      .setTitle("Error")
      .setDescription(
        `You do not have all the required permission(s) for this command. You also need the following permission(s):\n\n\`\`\`${checkcmd.permissions
          .filter((n) => !message.member.hasPermission(n))
          .join(", ")}\`\`\``
      )
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed);
    return;
  }

  if (
    !message.guild.members.get(client.user.id).hasPermission(checkcmd.needperms)
  ) {
    const embed = new Discord.RichEmbed()
      .setColor(client.warning)
      .setTitle("Error")
      .setDescription(
        `I do not have the required permission(s) for this command. I also need the following permission(s):\n\n\`\`\`${checkcmd.needperms
          .filter(
            (n) => !message.guild.members.get(client.user.id).hasPermission(n)
          )
          .join(", ")}\`\`\``
      )
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed);
    return;
  }

  try {
    checkcmd.execute(message, args, client);
  } catch (error) {
    console.error(error);
    const embed = new Discord.RichEmbed()
      .setColor(client.warning)
      .setTitle("Error")
      .setDescription(
        `There was an error trying to execute that command.\n\n\`\`\`js\n${error}\`\`\``
      )
      .setFooter(`Executed by ${message.author.tag}`, message.author.avatarURL)
      .setTimestamp(message.createdTimestamp);
    message.channel.send(embed);
  }
});

client.on("guildMemberAdd", (member) => {
  if (member.guild.id === "572993536304087065") {
    const embed = new Discord.RichEmbed()
      .setColor(client.other)
      .setTitle("Welcome!")
      .setDescription(
        `Welcome <@${member.id}> to the **Chain** support server! Be sure to check <#587072454631882773> for terms and conditions for the server. Enjoy your stay! <:kappa:665407289062326293>`
      )
      .setThumbnail(member.user.avatarURL)
      .setTimestamp(Date.now());
    client.channels.get("665388960125681665").send(embed);

    member.addRole("666169355607736355");
  }
});

client.on("guildMemberRemove", (member) => {
  if (member.guild.id === "572993536304087065") {
    const embed = new Discord.RichEmbed()
      .setColor(client.other)
      .setTitle("Farewell!")
      .setDescription(
        `Goodbye <@${member.id}>, from the **Chain** bot developers! We hope to see you soon. <:kappa:665407289062326293>`
      )
      .setThumbnail(member.user.avatarURL)
      .setTimestamp(Date.now());
    client.channels.get("665388960125681665").send(embed);
  }
});

client.on("messageReactionAdd", function (reaction, user) {
  if (reaction.message.id === "666168969064873984") {
    reaction.remove();
    const member = reaction.message.guild.members.get(user.id);
    member
      .addRole("665461107829243934")
      .then(() => member.removeRole("666169355607736355"));
  }
});

// client.on('messageReactionAdd', function(reaction, user) {

//    if (reaction.message.channel.id == '665730536957804544') {

//        if (reaction._emoji.id == '665731359708545069') {

//            if (reaction.count >= 2) {

//                reaction.message.clearReactions().then(()=>{reaction.message.react('✅')}).catch('');

//            }

//        } else {

//            if (reaction.count >= 2) {

//                reaction.message.delete();

//            }

//        }

//    }

// });

client.login(require("./secret.json").token);

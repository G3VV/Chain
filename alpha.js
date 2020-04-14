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

const fs = require("fs");
const Discord = require("discord.js");
const similarstring = require("string-similarity");
const config = require("./config.json");
const client = new Discord.Client();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
const devFiles = fs
  .readdirSync("./devcommands")
  .filter(file => file.endsWith(".js"));

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
  client.other = client.colors.client.otheralpha;
  client.gold = client.colors.client.gold;
  client.prefix = config.client.alphaprefix;
  client.devprefix = config.client.alphadevprefix;
  client.version = config.client.version;

  client.servers = {};

  console.log("Bot ready!");
  client.user.setStatus("dnd");

  const embed2 = new Discord.RichEmbed()
    .setColor(client.other)
    .setTitle("Status")
    .setDescription("Bot online.")
    .setTimestamp(Date.now());

  client.channels.get("665390784165576714").send(embed2);

  client.user.setActivity(`v${client.version} | ${client.prefix}help`, {
    type: "PLAYING"
  });
  let status = 1;

  setInterval(() => {
    if (status == 2) status = 0;
    if (status == 0) {
      client.user.setActivity(`over the server.`, { type: "WATCHING" });
    } else {
      client.user.setActivity(`v${client.version} | ${client.prefix}help`, {
        type: "PLAYING"
      });
    }

    status++;

    client.guilds
      .filter(n => n.voiceConnection)
      .map(m => {
        if (
          m.voiceConnection.channel.members.filter(n => !n.user.bot).size <= 0
        ) {
          let server = client.servers[m.id];

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

client.on("message", message => {
  if (
    message.content == "<@!645824637338386433>" &&
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
              .permissions.filter(n => !message.member.hasPermission(n))
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
                n => !message.guild.members.get(client.user.id).hasPermission(n)
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
    message.channel.type == "text" &&
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
          cmd => cmd.aliases && cmd.aliases.includes(command)
        );

      if (!checkcmd) {
        const embed = new Discord.RichEmbed()
          .setColor(client.warning)
          .setTitle("Unknown Command")
          .setDescription(
            `Did you mean \`${client.devprefix +
              similarstring.findBestMatch(
                command,
                client.devcommands.map(m => m.name)
              ).bestMatch.target}\`?\n\nUse \`${
              client.devprefix
            }help\` for a list of dev commands.`
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
              .filter(n => !message.member.hasPermission(n))
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
                n => !message.guild.members.get(client.user.id).hasPermission(n)
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
    message.channel.type != "text"
  )
    return;

  console.log(message.channel.permissionOverwrites);

  if (!message.guild.members.get(client.user.id).hasPermission("SEND_MESSAGES"))
    return;

  const args = message.content.slice(client.prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const checkcmd =
    client.commands.get(command) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

  if (!checkcmd) {
    const embed = new Discord.RichEmbed()
      .setColor(client.warning)
      .setTitle("Unknown Command")
      .setDescription(
        `Did you mean \`${client.prefix +
          similarstring.findBestMatch(
            command,
            client.commands.map(m => m.name)
          ).bestMatch.target}\`?\n\nUse \`${
          client.prefix
        }help\` for a list of commands.`
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
          .filter(n => !message.member.hasPermission(n))
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
            n => !message.guild.members.get(client.user.id).hasPermission(n)
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

client.login(secret.alphatoken);

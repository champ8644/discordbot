const { MessageEmbed } = require("discord.js");

const prefix = "!mc";

const commandHelpText = ["Welcome to MC-server-moderator bot commands"];

const commandHelp = {
  open: {
    args: [],
    description: "Open the server and start initialized of mc server.",
  },
  sesame: {
    args: [],
    description: "Same as open command but more stylish.",
  },
  help: {
    args: [],
    description: "List avaliable commands.",
  },
};

const { turnOnKCMHPC } = require("./turnOnKCMHPC");

Object.keys(commandHelp).forEach((commandKey) => {
  const { args, description } = commandHelp[commandKey];
  const argsText = args
    .map(
      ([argKey, argType, isOptional]) =>
        `[${argKey}: ${argType}]${isOptional ? "?" : ""}`
    )
    .join(" ");
  commandHelpText.push(
    "    " + commandKey + " " + argsText + " - " + description
  );
});

function mcAcceptCommand(message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  switch (command) {
    case "sesame":
    case "open": {
      turnOnKCMHPC().then((res) => {
        if (res) message.reply(res);
      });
      return;
    }
    case "":
    case "help": {
      message.channel.send(commandHelpText.join("\n"));
      return;
    }
    default:
  }
}
module.exports = { mcAcceptCommand };

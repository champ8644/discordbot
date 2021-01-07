const prefix = "!nep";

const { events } = require("../commands/events");

const commandHelpText = ["Welcome to Nep-A-Live bot commands"];

const commandHelp = {
  events: {
    args: [
      ["count?", "number", true],
      ["type?", "'chara' | 'seiyuu'"],
    ],
    description: "List next incoming events.",
  },
  help: {
    args: [],
    description: "List avaliable commands.",
  },
};

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

function acceptCommand(message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  switch (command) {
    case "events": {
      let query = 1;
      let type;
      if (args.length > 0) {
        if (Number.isInteger(Number(args[0]))) query = args[0];
        else if (args[0] === "chara" || args[0] === "seiyuu") type = args[0];
        else {
          message.channel.send(
            `Error in command name: ${command}\n${message.author}, The argument is Invalid.`
          );
          return;
        }
      }
      if (query > 10) {
        message.channel.send(
          `Error in command name: ${command}\n${message.author}, The max query is 10 events.`
        );
        return;
      }
      if (args.length > 1) {
        if (args[1] === "chara" || args[1] === "seiyuu") type = args[1];
        else {
          message.channel.send(
            `Error in command name: ${command}\n${message.author}, Second argument is not type of 'chara' | 'seiyuu'`
          );
          return;
        }
      }
      events(message.channel, query, type);
      return;
    }
    case "help": {
      message.channel.send(commandHelpText.join("\n"));
      return;
    }
    case "GG": {
      message.channel.send("Congratulations!!");
      return;
    }
    case "test":
      if (!args.length) {
        return message.channel.send(
          `You didn't provide any arguments, ${message.author}!`
        );
      }
      message.channel.send(`Command name: ${command}\nArguments: ${args}`);
      return;
    case "": {
      message.channel.send(commandHelpText.join("\n"));
      return;
    }
    default:
  }
}
module.exports = { acceptCommand };

const prefix = "!nep";

function acceptCommand(message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  switch (command) {
    case "say":
      if (!args.length) {
        return message.channel.send(
          `You didn't provide any arguments, ${message.author}!`
        );
      }
      message.channel.send(`Command name: ${command}\nArguments: ${args}`);
      return;
    default: {
      message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    }
  }
}
module.exports = { acceptCommand };

const prefix = "!nep";

function acceptCommand(message) {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  console.log({ command, args });
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
      message.channel.send(JSON.stringify(message));
      console.log(message);
    }
  }
}
module.exports = { acceptCommand };

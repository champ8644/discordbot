async function send(channel, message, options = {}) {
  const { shouldDelete, withReactions } = options;
  if (typeof message === "string") {
    channel.send(message);
    return;
  }
  let messageSent;
  if (message.attachments.size > 0) {
    messageSent = await channel.send(message.attachments.values().next().value);
  } else messageSent = await channel.send(message.content);
  if (withReactions) {
    message.reactions.cache.forEach((item) => {
      if (item._emoji.id) messageSent.react(item._emoji.id);
      else messageSent.react(item._emoji.name);
    });
  }
  if (shouldDelete) await message.delete();
  return messageSent;
}
module.exports = { send };

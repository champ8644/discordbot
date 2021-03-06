const { getChannel } = require("./getChannel");

async function send(_channel, message, options = {}) {
  try {
    const { shouldDelete, withReactions, API } = options;
    let channel;

    if (typeof _channel === "string") channel = await getChannel(_channel);
    else channel = _channel;

    if (typeof message === "string" || API) return channel.send(message);

    let messageSent;
    if (message.attachments.size > 0) {
      messageSent = await channel.send(
        message.attachments.values().next().value
      );
    } else messageSent = await channel.send(message.content);
    if (withReactions) {
      message.reactions.cache.forEach((item) => {
        if (item._emoji.id) messageSent.react(item._emoji.id);
        else messageSent.react(item._emoji.name);
      });
    }
    if (shouldDelete && message.deletable) await message.delete();
    return messageSent;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { send };

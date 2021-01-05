async function loopFetch(channel) {
  const arr = [];
  let before;
  let done = 0;
  do {
    const messages = await channel.messages.fetch({ limit: 10, before });
    if (messages.size === 0) break;
    await messages.forEach((message) => {
      if (!done) {
        if (message.reactions.cache.size > 0) {
          done++;
        } else {
          arr.push(message);
          before = message.id;
        }
      }
    });
  } while (!done);

  return arr;
}

module.exports = { loopFetch };

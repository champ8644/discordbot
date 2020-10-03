async function partialCheck(reaction) {
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
      await reaction.fetch();
    } catch (error) {
      reaction.message.channel.send(
        "Something went wrong when fetching the reaction.: ",
        error
      );
      return;
    }
  }
}
module.exports = { partialCheck };

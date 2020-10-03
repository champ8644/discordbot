const { getCleanChannel } = require("../utils/getChannel");

async function fukukaichouClean(reaction, user) {
  const member = reaction.message.guild.members.cache.get(user.id);
  const isJanitor = member.roles.cache.has("761867672496635914"); // Janitor
  if (isJanitor) {
    const destCleanChannelName = `ถังขยะ-${user.username.toLowerCase()}`;
    const destCleanChannel = getCleanChannel(destCleanChannelName);
    const sentMessage = await destCleanChannel.send(reaction.message.content);
    reaction.message.reactions.cache.forEach((item) => {
      if (!item._emoji.delete) {
        if (item._emoji.id) sentMessage.react(item._emoji.id);
        else sentMessage.react(item._emoji.name);
      }
    });
    reaction.message.delete();
  }
}
module.exports = { fukukaichouClean };

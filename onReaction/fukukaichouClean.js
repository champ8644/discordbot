const { getCleanChannel } = require("../utils/getChannel");
const { send } = require("../utils/send");
const { onError } = require("../utils/errorHandle");

async function fukukaichouClean(reaction, user) {
  try {
    const member = reaction.message.guild.members.cache.get(user.id);
    const isJanitor = member.roles.cache.has("761867672496635914"); // Janitor
    if (isJanitor) {
      const destCleanChannelName = `ถังขยะ-${user.username.toLowerCase()}`;
      const destCleanChannel = await getCleanChannel(destCleanChannelName);
      await send(destCleanChannel, reaction.message, {
        withReactions: true,
        shouldDelete: true,
      });
    }
  } catch (error) {
    onError(error);
  }
}
module.exports = { fukukaichouClean };

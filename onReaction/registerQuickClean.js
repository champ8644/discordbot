const { getChannelById } = require("../utils/getChannel");
const { roomname } = require("../utils/roomname");
const { send } = require("../utils/send");

const { onError } = require("../utils/errorHandle");

async function registerQuickClean(reaction, user) {
  try {
    let member = reaction.message.guild.members.cache.get(user.id);
    if (!member) member = await reaction.message.guild.members.fetch(user.id);
    const isJanitor = member.roles.cache.has("761867672496635914"); // Janitor
    if (isJanitor) {
      const destCleanChannel = await getChannelById(
        roomname["งานรีบกำลังคลีน"]
      );
      await send(destCleanChannel, reaction.message, {
        withReactions: true,
        shouldDelete: true,
      });
    }
  } catch (error) {
    onError(error, { reaction, user });
  }
}
module.exports = { registerQuickClean };

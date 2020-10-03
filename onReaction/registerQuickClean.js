const { getChannelById } = require("../utils/getChannel");
const { roomname } = require("../utils/roomname");
const { send } = require("../utils/send");

async function registerQuickClean(reaction, user) {
  const member = reaction.message.guild.members.cache.get(user.id);
  const isJanitor = member.roles.cache.has("761867672496635914"); // Janitor
  if (isJanitor) {
    const destCleanChannel = await getChannelById(roomname["งานรีบกำลังคลีน"]);
    const sentMessage = await send(destCleanChannel, reaction.message, {
      withReactions: true,
      shouldDelete: true,
    });
  }
}
module.exports = { registerQuickClean };

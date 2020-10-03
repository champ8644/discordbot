const { getChannelById } = require("../utils/getChannel");
const { send } = require("../utils/send");

async function captainClean(reaction, user, destId) {
  const member = reaction.message.guild.members.cache.get(user.id);
  const isTranslator = member.roles.cache.has("762003560303951883"); // Translator
  if (isTranslator) {
    const dest = await getChannelById(destId);
    const sentMessage = await send(dest, reaction.message, {
      withReactions: true,
      shouldDelete: true,
    });
  }
}
module.exports = { captainClean };

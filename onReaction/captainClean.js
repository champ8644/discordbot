const { getChannelById } = require("../utils/getChannel");
const { send } = require("../utils/send");
const { onError } = require("../utils/errorHandle");

async function captainClean(reaction, user, destId) {
  try {
    let member = reaction.message.guild.members.cache.get(user.id);
    if (!member) member = await reaction.message.guild.members.fetch(user.id);
    const isTranslator = member.roles.cache.has("762003560303951883"); // Translator
    if (isTranslator) {
      const dest = await getChannelById(destId);
      await send(dest, reaction.message, {
        withReactions: true,
        shouldDelete: true,
      });
    }
  } catch (error) {
    onError(error, { reaction, user, destId });
  }
}
module.exports = { captainClean };

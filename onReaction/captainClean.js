const { getChannelById } = require("../utils/getChannel");

async function captainClean(reaction, user, destId) {
  const member = reaction.message.guild.members.cache.get(user.id);
  const isTranslator = member.roles.cache.has("762003560303951883"); // Translator
  if (isTranslator) {
    console.log("captainClean -> destId", destId);
    const dest = await getChannelById(destId);
    const sentMessage = await dest.send(reaction.message.content);
    reaction.message.reactions.cache.forEach((item) => {
      if (!item._emoji.delete) {
        if (item._emoji.id) sentMessage.react(item._emoji.id);
        else sentMessage.react(item._emoji.name);
      }
    });
    reaction.message.delete();
  }
}
module.exports = { captainClean };

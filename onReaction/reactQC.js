const { getChannel } = require("../utils/getChannel");
const { send } = require("../utils/send");

async function reactQC(reaction, user) {
  const member = reaction.message.guild.members.cache.get(user.id);
  const isProofReader = member.roles.cache.has("762033050825392188"); // Proof Reader
  if (isProofReader) {
    let destChannel;
    switch (reaction.emoji.name) {
      case "👍": {
        destChannel = await getChannel("ห้องqcPass");
        const sentMessage = await send(destChannel, reaction.message, {
          shouldDelete: true,
        });
        await sentMessage.react("👍");
        break;
      }
      case "👎": {
        destChannel = await getChannel("ห้องqcFail");
        const sentMessage = await send(destChannel, reaction.message, {
          shouldDelete: true,
        });
        await sentMessage.react("👎");
        break;
      }
      default:
        return;
    }
  }
}
module.exports = { reactQC };

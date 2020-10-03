async function addReactionQC(message) {
  await message.react(":thumbsup:");
  await message.react(":thumbsdown:");
}
module.exports = { addReactionQC };

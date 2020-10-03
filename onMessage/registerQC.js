async function registerQC(message) {
  await message.react("👍");
  await message.react("👎");
}
module.exports = { registerQC };

async function registerQC(message) {
  try {
    await message.react("👍");
    await message.react("👎");
  } catch (error) {
    console.error(error);
  }
}
module.exports = { registerQC };

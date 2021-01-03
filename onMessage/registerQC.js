const { onError } = require("../utils/errorHandle");

async function registerQC(message) {
  try {
    await message.react("👍");
    await message.react("👎");
  } catch (error) {
    onError(error);
  }
}
module.exports = { registerQC };

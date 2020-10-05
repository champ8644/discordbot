const { loopFetch } = require("./loopFetch");

async function cleanRoom(channel) {
  const arr = await loopFetch(channel);
  await Promise.all(arr.map((message) => message.delete()));
  console.log("finished cleaning");
}

module.exports = { cleanRoom };

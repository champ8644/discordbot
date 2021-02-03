const { loopFetch } = require("./loopFetch");

async function cleanRoom(channel) {
  const arr = await loopFetch(channel);
  console.log("🚀 ~ file: cleanRoom.js ~ line 5 ~ cleanRoom ~ arr", arr);
  await Promise.all(
    arr.map(async (message) => {
      await message.fetch();
      message.delete();
    })
  );
  console.log("finished cleaning");
}

module.exports = { cleanRoom };

const pjson = require("../package.json");
const { bot } = require("../utils/Discord");
const { getChannel } = require("../utils/getChannel");
const { send } = require("../utils/send");

async function welcomeScreen() {
  console.log(`${bot.user.username} ver${pjson.version} Is Online!`);
  send(
    await getChannel("ห้องสถานะบอท"),
    `${bot.user.username} ver${pjson.version} Is Online!`
  );
}
module.exports = { welcomeScreen };

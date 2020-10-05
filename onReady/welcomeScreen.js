const pjson = require("../package.json");
const { bot } = require("../utils/Discord");
const { getChannel } = require("../utils/getChannel");

function welcomeScreen() {
  console.log(`${bot.user.username} ver${pjson.version} Is Online!`);
  getChannel("ห้องสถานะบอท").send(
    `${bot.user.username} ver${pjson.version} Is Online!`
  );
}
module.exports = { welcomeScreen };

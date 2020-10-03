const pjson = require("../package.json");
const { bot } = require("../utils/Discord");

function welcomeScreen() {
  console.log(`${bot.user.username} ver${pjson.version} Is Online!`);
}
module.exports = { welcomeScreen };

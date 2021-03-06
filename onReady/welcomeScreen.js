const pjson = require("../package.json");
const { bot } = require("../utils/Discord");
const { getChannel } = require("../utils/getChannel");
const { send } = require("../utils/send");
const { onError } = require("../utils/errorHandle");

async function welcomeScreen(status) {
  try {
    let statusPost = "Is Testing...";
    if (status === "PROD") statusPost = "Is Online!";
    console.log(`${bot.user.username} ver${pjson.version} ${statusPost}`);
    send(
      await getChannel("ห้องหุ่นมิเชล"),
      `${bot.user.username} ver${pjson.version} ${statusPost}`
    );
  } catch (error) {
    onError(error, { status });
  }
}
module.exports = { welcomeScreen };

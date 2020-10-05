const { bot } = require("../utils/Discord");
const { input } = require("./input");
const { getChannelById } = require("../utils/getChannel");
const { delay } = require("./delay");

async function start() {
  const channel = getChannelById("761963411592446002");
  for (let i = 0; i < input.length; i++) {
    console.log("start -> i", i);
    await channel.send(input[i]);
    // await delay(2000);
  }
}

function postDiscord() {
  start();
}
module.exports = { postDiscord };

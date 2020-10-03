require("dotenv").config();

const { bot } = require("./utils/Discord");

const { welcomeScreen } = require("./onReady/welcomeScreen");
bot.on("ready", async () => {
  welcomeScreen();
  // const arr = await loopFetch();
  // const newTimerRoom = await bot.channels.cache.get("761898397451026452");
  // await moving(arr, newTimerRoom);
  // console.log("finsihing jobs");
});

const { fukukaichouClean } = require("./onReaction/fukukaichouClean");
const { partialCheck } = require("./onReaction/partialCheck");
bot.on("messageReactionAdd", async (reaction, user) => {
  // When we receive a reaction we check if the reaction is partial or not
  await partialCheck(reaction);
  switch (reaction.message.channel.id) {
    case roomname["ห้องงานรีบ-ใหม่"]:
    case roomname["ห้องงานคลีน-ใหม่"]:
    case roomname["ห้องคอมมิค-ใหม่"]:
    case roomname["ห้องงานยาก-ใหม่"]:
      fukukaichouClean(reaction, user);
      return;
  }
});

const { acceptCommand } = require("./onMessage/acceptCommand");
const { sortJobs } = require("./onMessage/sortJobs");
bot.on("message", (message) => {
  if (message.author.bot) return;
  switch (message.channel.id) {
    case roomname["ห้องส่งงาน"]:
      sortJobs(message);
      return;
    case roomname["ห้องทดลอง"]:
      acceptCommand(message);
      return;
  }
});

bot.login(process.env.token);

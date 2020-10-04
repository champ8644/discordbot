require("dotenv").config();

const { bot } = require("./utils/Discord");
const { roomname } = require("./utils/roomname");

const { welcomeScreen } = require("./onReady/welcomeScreen");
bot.on("ready", async () => {
  welcomeScreen();
  // const arr = await loopFetch();
  // const newTimerRoom = await bot.channels.cache.get("761898397451026452");
  // await moving(arr, newTimerRoom);
});

const { fukukaichouClean } = require("./onReaction/fukukaichouClean");
const { captainClean } = require("./onReaction/captainClean");
const { partialCheck } = require("./onReaction/partialCheck");
const { registerQuickClean } = require("./onReaction/registerQuickClean");
const { reactQC } = require("./onReaction/reactQC");
bot.on("messageReactionAdd", async (reaction, user) => {
  // When we receive a reaction we check if the reaction is partial or not
  if (user.bot) return;
  await partialCheck(reaction);
  switch (reaction.message.channel.id) {
    case "761957637657985060": // ห้องงานรีบ-ใหม่
    case "761963747308601344": // ห้องคอมมิค-ใหม่
      registerQuickClean(reaction, user);
    case "761898397451026452": // ห้องงานคลีน-ใหม่
    case "761961486524350485": // ห้องงานยาก-ใหม่
      fukukaichouClean(reaction, user);
      return;
    case "761962591022481438": // ห้องส่งงานรีบ
      captainClean(reaction, user, roomname["ถังขยะห้องส่งงาน"]);
      return;
    case "761959220831584277": // ห้องส่งงานคลีน
      captainClean(reaction, user, roomname["ถังขยะห้องส่งงาน"]);
      return;
    case "575701679744483338": // ห้องลิ้งภาพ
      captainClean(reaction, user, roomname["ถังขยะห้องลิ้งภาพ"]);
      return;
    case "761957871880503316": // ห้องแจ้ง QC
      reactQC(reaction, user);
      return;
  }
});

const { acceptCommand } = require("./onMessage/acceptCommand");
const { sortJobs } = require("./onMessage/sortJobs");
const { registerQC } = require("./onMessage/registerQC");
bot.on("message", async (message) => {
  if (message.author.bot) return;
  await partialCheck(message);
  switch (message.channel.id) {
    case "761963411592446002": // ห้องส่งงาน
      sortJobs(message);
      return;
    case "761957871880503316": // ห้องแจ้ง QC
      registerQC(message);
      return;
    case "726319165048356944": // ห้องทดลอง
      acceptCommand(message);
      return;
  }
});

bot.login(process.env.token);

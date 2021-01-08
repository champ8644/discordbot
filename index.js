require("dotenv").config();

const { bot } = require("./utils/Discord");
const { roomname } = require("./utils/roomname");
const { onError, onRejection } = require("./utils/errorHandle");

class queueAsyncClass {
  constructor() {
    this.queue = [];
    this.working = false;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  async execute() {
    if (this.isEmpty()) {
      this.working = false;
      return;
    }
    const callBack = this.queue.shift();
    await callBack();
    if (this.working) return this.execute();
  }

  start() {
    if (!this.working) {
      this.working = true;
      return this.execute();
    }
  }

  stop() {
    this.working = false;
  }

  add(callBack) {
    this.queue.push(callBack);
    this.start();
  }
}

const queueAsync = new queueAsyncClass();

const { welcomeScreen } = require("./onReady/welcomeScreen");
const { postDiscord } = require("./functions/postDiscord");
const { cleanRoom } = require("./functions/cleanRoom");
const { getChannelById, getChannel } = require("./utils/getChannel");
const { fetchRoom } = require("./utils/fetchRoom.js");
const { db } = require("./utils/postgres.js");
const { HBDCheck } = require("./onReady/HBDCheck.js");
bot.on("ready", async () => {
  try {
    await db.connect();
    // HBDCheck();
    await fetchRoom();
    await welcomeScreen(process.env.status);
    // postDiscord();
    // cleanRoom(getChannelById("762691667559972884")); // ห้องคลีนtest
    // cleanRoom(getChannelById("761963411592446002")); // ห้องส่ง
    // const arr = await loopFetch();
    // const newTimerRoom = await bot.channels.cache.get("761898397451026452");
    // await moving(arr, newTimerRoom);
    process.on("uncaughtException", (err) => {
      onError(err);
      process.exit(1);
    });
    process.on("unhandledRejection", (reason, promise) => {
      onRejection(reason, promise);
      process.exit(1);
    });
  } catch (error) {
    onError(error);
  }
});

const { fukukaichouClean } = require("./onReaction/fukukaichouClean");
const { captainClean } = require("./onReaction/captainClean");
const { partialCheck } = require("./onReaction/partialCheck");
const { registerQuickClean } = require("./onReaction/registerQuickClean");
const { reactQC } = require("./onReaction/reactQC");
bot.on("messageReactionAdd", async (reaction, user) => {
  try {
    // When we receive a reaction we check if the reaction is partial or not
    if (user.bot) return;
    await partialCheck(reaction);
    switch (reaction.message.channel.id) {
      case "761957637657985060": // ห้องงานรีบ-ใหม่
      case "761963747308601344": // ห้องคอมมิค-ใหม่
        registerQuickClean(reaction, user);
      case "761898397451026452": // ห้องงานคลีน-ใหม่
      case "761961486524350485": // ห้องงานยาก-ใหม่
        queueAsync.add(async () => fukukaichouClean(reaction, user));
        return;
      case "761962591022481438": // ห้องส่งงานรีบ
        queueAsync.add(async () =>
          captainClean(reaction, user, roomname["ถังขยะห้องส่งงาน"])
        );
        return;
      case "761959220831584277": // ห้องส่งงานคลีน
        queueAsync.add(async () =>
          captainClean(reaction, user, roomname["ถังขยะห้องส่งงาน"])
        );
        return;
      case "575701679744483338": // ห้องลิ้งภาพ
        queueAsync.add(async () =>
          captainClean(reaction, user, roomname["ถังขยะห้องลิ้งภาพ"])
        );
        return;
      case "761957871880503316": // ห้องแจ้ง QC
        queueAsync.add(async () => reactQC(reaction, user));
        return;
    }
  } catch (error) {
    onError(error, { reaction, user });
  }
});

const { acceptCommand } = require("./onMessage/acceptCommand");
const { sortJobs } = require("./onMessage/sortJobs");
const { registerQC } = require("./onMessage/registerQC");
bot.on("message", async (message) => {
  try {
    await partialCheck(message);
    switch (message.channel.id) {
      case "762684068357472276": // ห้องหุ่นมิเชล
        acceptCommand(message);
        return;
      case "761963411592446002": // ห้องส่งงาน
        queueAsync.add(async () => sortJobs(message));
        return;
      case "761957871880503316": // ห้องแจ้ง QC
        queueAsync.add(async () => registerQC(message));
        return;
      case "726319165048356944": // ห้องทดลอง
        acceptCommand(message);
        return;
    }
  } catch (error) {
    onError(error, { message });
  }
});

bot.login(process.env.token);

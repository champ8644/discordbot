require("dotenv").config();
const Discord = require("discord.js");
const pjson = require("./package.json");
const bot = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

async function loopFetch() {
  const arr = [];
  let before;
  let done = false;
  do {
    const messages = await bot.channels.cache
      .get("575697652247822357")
      .messages.fetch({ limit: 10, before });

    await messages.forEach((message) => {
      if (done < 5) {
        if (message.reactions.cache.size > 0) {
          done++;
        } else {
          arr.push(message);
          before = message.id;
        }
      }
    });
    console.log(arr.length);
  } while (done < 5);

  return arr;
}

function delay(t, v) {
  return new Promise(function (fresolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

async function moving(arr, room) {
  const callBack = arr.map((message) => {
    return () => {
      room.send(message.content);
      message.delete();
    };
  });
  for (let i = 0; i < callBack.length; i++) {
    callBack[i]();
    console.log(`write message ${i + 1}/${callBack.length}`);
    await delay(1100);
  }
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} ver${pjson.version} Is Online!`);
  // const arr = await loopFetch();
  // const newTimerRoom = await bot.channels.cache.get("761898397451026452");
  // await moving(arr, newTimerRoom);
  // console.log("finsihing jobs");
});

async function partialCheck(reaction) {
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
      const reacted = await reaction.fetch();
    } catch (error) {
      reaction.message.channel.send(
        "Something went wrong when fetching the reaction.: ",
        error
      );
      return;
    }
  }
}

const roomname = {
  "ห้องงานรีบ-ใหม่": "761957637657985060",
  "ห้องงานคลีน-ใหม่": "761898397451026452",
  "ห้องคอมมิก-ใหม่": "761963747308601344",
  "ห้องงานยาก-ใหม่": "761961486524350485",
  ห้องส่งงาน: "761963411592446002",
  ห้องส่งงานรีบ: "761962591022481438",
  ห้องส่งงานคลีน: "761959220831584277",
  ห้องลิ้งภาพ: "575701679744483338",
  "ถังขยะ-ห้องส่งงาน": "575697956309565442",
  "ถังขยะ-ห้องลิ้งภาพ": "761959769396609024",
  "ห้องแจ้ง-qc": "761957871880503316",
  "ห้อง-qc-approved": "761960948717846538",
};

bot.on("messageReactionAdd", async (reaction, user) => {
  // When we receive a reaction we check if the reaction is partial or not
  await partialCheck(reaction);

  if (reaction.message.channel.id == 726319165048356944) {
    const member = reaction.message.guild.members.cache.get(user.id);
    const isJanitor = member.roles.cache.has("761867672496635914"); // Janitor
    if (isJanitor) {
      const destCleanChannelName = `ห้อง-${user.username.toLowerCase()}-cleaned`;
      let destCleanChannel = await reaction.message.guild.channels.cache.find(
        (channel) => {
          if (channel.parent?.name === "Warning: Lightning Storm Created") {
            if (channel.name === destCleanChannelName) return true;
          }
        }
      );
      if (!destCleanChannel) {
        destCleanChannel = await reaction.message.guild.channels.create(
          `ห้อง-${user.username.toLowerCase()}-cleaned`,
          {
            type: "text",
            parent: "575697799111376946",
          }
        );
      }
      reaction.message.delete();
      console.log("destCleanChannel", destCleanChannel.send);
      const sentMessage = await destCleanChannel.send(reaction.message.content);
      reaction.message.reactions.cache.forEach((item) => {
        if (!item._emoji.delete) {
          if (item._emoji.id) sentMessage.react(item._emoji.id);
          else sentMessage.react(item._emoji.name);
        }
      });
    }
  }
});

const prefix = "!nep";
const twitterRegex = new RegExp(/twitter\.com\/(.*)\/status\/(\d*)/);
const oneDriveRegex = new RegExp(/payap-my\.sharepoint\.com/);
const gDriveRegex = new RegExp(/drive\.google\.com/);

function parseLinkType(link) {
  const twitParse = twitterRegex.exec(link);
  if (twitParse) return { type: "twitter", parse: twitParse };
  const oneDriveParse = oneDriveRegex.exec(link);
  if (oneDriveParse) return { type: "oneDrive", parse: oneDriveParse };
  const gDriveParse = gDriveRegex.exec(link);
  if (gDriveParse) return { type: "gDrive", parse: gDriveParse };
  return { type: null };
}

async function sortJobs(message) {
  const latestLink = parseLinkType(message.content);
  if (latestLink.type) {
    const messages = await message.channel.messages.fetch({ limit: 2 });
    if (!latestLink.type) return;
    if (messages.length < 2) return;
    const iterator = messages.values();
    iterator.next();
    const message2 = iterator.next().value;
    const secondLink = parseLinkType(message2.content);
    if (!secondLink.type) return;
    let rawLink;
    let cleanLink;
    if (latestLink.type === "twitter" && secondLink.type !== "twitter") {
      rawLink = message;
      cleanLink = message2;
    } else if (latestLink.type !== "twitter" && secondLink.type === "twitter") {
      rawLink = message2;
      cleanLink = message;
    } else return;

    const quickMessage = await bot.channels.cache
      .get(roomname["ห้องงานรีบ-ใหม่"])
      .messages.fetch();
    let isQuick = false;
    quickMessage.forEach((m) => {
      if (m.content === rawLink.content) isQuick = true;
    });

    let destRoom;
    if (isQuick) destRoom = bot.channels.cache.get(roomname["ห้องส่งงานรีบ"]);
    else destRoom = bot.channels.cache.get(roomname["ห้องส่งงานคลีน"]);

    destRoom.send(rawLink.content);
    destRoom.send(cleanLink.content);
    rawLink.delete();
    cleanLink.delete();
  }
}

bot.on("message", (message) => {
  if (message.author.bot) return;
  switch (message.channel.id) {
    case roomname["ห้องส่งงาน"]:
      console.log("message in");
      sortJobs(message);
      return;
  }
  // if (message.channel.id == roomname["ห้องส่งงาน"]) {
  //   if (message.embeds.length > 0 || message.attachments.size > 0) {
  //     //    message.channel.send(
  //     //     `link recieved Embeds:${message.embeds.length} Attach:${message.attachments.size}`
  //     //    );
  //     //  console.log("message", message);
  //   }
  // } else {
  //   // console.log("ห้องอื่น");
  //   //   console.log("message.channel.id", message.channel.id);
  //   //   const args = message.content.slice(prefix.length).trim().split(/ +/);
  //   //   const command = args.shift().toLowerCase();
  //   //   console.log({ command, args });
  //   //   switch (command) {
  //   //     case "say":
  //   //       if (!args.length) {
  //   //         return message.channel.send(
  //   //           `You didn't provide any arguments, ${message.author}!`
  //   //         );
  //   //       }
  //   //       message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  //   //       return;
  //   //     default: {
  //   //       message.channel.send(JSON.stringify(message));
  //   //       console.log(message);
  //   //     }
  //   //   }
  // }
});

bot.login(process.env.token);

// 761680944091365436

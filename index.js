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
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

async function moving(arr, room) {
  const callBack = arr.map((message) => {
    return () => {
      // room.send(message.content);
      message.delete();
    };
  });
  for (let i = 0; i < callBack.length; i++) {
    callBack[i]();
    console.log(`write message ${i + 1}/${callBack.length}`);
    // await delay(1100);
  }
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} ver${pjson.version} Is Online!`);
  // const arr = await loopFetch();
  // const newTimerRoom = await bot.channels.cache.get("761898397451026452");
  // await moving(arr, newTimerRoom);
  // console.log("finsihing jobs");
});

bot.on("messageReactionAdd", async (reaction, user) => {
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

      // When we receive a reaction we check if the reaction is partial or not
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
      // Now the message has been cached and is fully available
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

bot.on("message", (message) => {
  if (message.author.bot) return;
  //   console.log("message");
  if (message.channel.id == 726319165048356944) {
    // console.log("ห้องทดลอง");
    if (message.embeds.length > 0 || message.attachments.size > 0) {
      message.channel.send(
        `link recieved Embeds:${message.embeds.length} Attach:${message.attachments.size}`
      );
      console.log("message", message);
    }
  } else {
    // console.log("ห้องอื่น");
    //   console.log("message.channel.id", message.channel.id);
    //   const args = message.content.slice(prefix.length).trim().split(/ +/);
    //   const command = args.shift().toLowerCase();
    //   console.log({ command, args });
    //   switch (command) {
    //     case "say":
    //       if (!args.length) {
    //         return message.channel.send(
    //           `You didn't provide any arguments, ${message.author}!`
    //         );
    //       }
    //       message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    //       return;
    //     default: {
    //       message.channel.send(JSON.stringify(message));
    //       console.log(message);
    //     }
    //   }
  }
});

bot.login(process.env.token);

// 761680944091365436

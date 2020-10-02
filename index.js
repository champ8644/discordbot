const Discord = require("discord.js");
const pjson = require("./package.json");
const bot = new Discord.Client();

bot.on("ready", () => {
  console.log(`${bot.user.username} ver${pjson.version} Is Online!`);
});

// bot.on("message", (msg) => {
//   if (msg.content === "ping") {
//     msg.reply("Pong!");
//   }
// });

bot.login(process.env.token);

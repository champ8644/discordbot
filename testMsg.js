require("dotenv").config();

const Discord = require("discord.js");
const { bot } = require("./utils/Discord");
const { send } = require("./utils/send");

const { generateReport } = require("./indexDaily");

const birthdayList = require("./character/birthdayList.json");

const todayEvents = birthdayList["13/09"];

const test = false;

bot.on("ready", async () => {
  try {
    if (!test) {
      todayEvents.forEach((event) => {
        generateReport(event);
      });
    } else {
      const embed = new Discord.MessageEmbed();
      embed.setColor("#FF5522");
      embed.setAuthor(
        "Nep-A-Live Cake Manager",
        "https://i.imgur.com/K1AWKjQ.jpg"
      );
      embed.setTitle("Title");
      embed.setDescription("description");
      embed.addField("name1", "value1", true);
      embed.addField("name2", "value2", true);
      embed.addField("name3", "value3", true);
      embed.addField("name4", "value4", true);
      embed.addField("name5", "value5", true);
      embed.addField("name6", "value6", true);
      embed.addField("name7", "value7", true);
      embed.addField("name8", "value8", true);
      embed.addField("name9", "value9", true);
      embed.setImage(
        "https://64.media.tumblr.com/1ce882994eb91782813ab6c1e67f2b27/tumblr_inline_onagy5YACG1uglnsc_1280.png"
      );
      embed.setFooter("footer");
      embed.setTimestamp(new Date());
      const msg = {
        embed,
      };

      send("ห้องทดลอง", msg, { API: true });
    }
  } catch (error) {
    console.error(error);
  }
});

bot.login(process.env.token);

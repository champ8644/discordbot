const Discord = require("discord.js");

exports.bot = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const Discord = require("discord.js");

const hook = new Discord.WebhookClient(
  process.env.TEST_ID,
  process.env.TEST_TOKEN
);

hook.send("I am now alive!");

const { bot } = require("./Discord");
const { roomname } = require("./roomname");

async function getChannel(name, parent) {
  try {
    if (roomname[name]) return bot.channels.cache.get(roomname[name]);

    let room = bot.channels.cache.find((channel) => {
      if (
        !parent ||
        (channel && channel.parent && channel.parent.id) == parent
      ) {
        if (channel.name === name) return true;
      }
    });
    if (room) return room;
    room = await bot.guilds.cache
      .get("575599886284619776")
      .channels.create(name, {
        type: "text",
        parent,
      });
    return room;
  } catch (error) {
    console.error(new Error(), error);
  }
}
function getCleanChannel(name) {
  return getChannel(name, "575697799111376946"); // โต๊ะทำงาน พนักงานคลีน
}
function getChannelById(id) {
  return bot.channels.cache.get(id);
}
module.exports = { getCleanChannel, getChannel, getChannelById };

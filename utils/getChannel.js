const { bot } = require("./Discord");

const roomname = {
  "ห้องงานรีบ-ใหม่": "761957637657985060",
  "ห้องงานคลีน-ใหม่": "761898397451026452",
  "ห้องคอมมิค-ใหม่": "761963747308601344",
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

async function getChannel(name, parent) {
  if (roomname[name]) return bot.channels.cache.get(roomname[name]);
  const room = bot.channels.cache.find((channel) => {
    if (channel.parent?.id == parent) {
      if (channel.name === name) return true;
    }
  });
  if (room) return room;
  room = await reaction.message.guild.channels.create(name, {
    type,
    parent,
  });
}
function getCleanChannel(name) {
  return getChannel(name, "575697799111376946"); // โต๊ะทำงาน พนักงานคลีน
}
module.exports = { getCleanChannel, getChannel };

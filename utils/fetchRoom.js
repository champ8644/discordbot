const fetchCleanList = [
  "ห้องงานรีบใหม่",
  "ห้องงานคลีนใหม่",
  "ห้องคอมมิคใหม่",
  "ห้องงานยากใหม่",
  "ห้องส่งงาน",
  "ห้องส่งงานรีบ",
  "ห้องส่งงานคลีน",
  "ห้องลิ้งภาพ",
  "ห้องแจ้งqc",
  "งานรีบกำลังคลีน",
];

// const fetchCleanList = [
//   "ห้องงานรีบใหม่",
//   "ห้องคอมมิคใหม่",
//   "ห้องส่งงาน",
//   "ห้องแจ้งqc",
//   "งานรีบกำลังคลีน",
// ];

const { parseLinkType } = require("../onMessage/sortJobs.js");
const { getChannel } = require("./getChannel.js");
const { onError } = require("./errorHandle");
async function fetchRoom() {
  try {
    const channelsMessages = await Promise.all(
      fetchCleanList.map((name) =>
        getChannel(name)
          .then((channel) => channel.messages.fetch())
          .then((messages) => {
            console.log(
              `fetching ${name} complete!, got ${messages.size} messages.`
            );
            return { name, messages };
          })
      )
    );
    channelsMessages.forEach(({ name, messages }) => {
      let cleaning = true;
      for (let value of messages.values()) {
        const linkType = parseLinkType(value);
        if (linkType.type !== null) {
          cleaning = false;
          break;
        }
      }
      if (cleaning && messages.size > 0) {
        console.log(`Room ${name} need cleaning!`);
        messages.forEach((message) => message.delete());
      }
    });
  } catch (error) {
    onError(error);
  }
}

module.exports = { fetchRoom };

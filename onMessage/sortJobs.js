const { getChannel } = require("../utils/getChannel");

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

    const quickMessage = await getChannel("ห้องงานรีบ-ใหม่").messages.fetch();
    let isQuick = false;
    quickMessage.forEach((m) => {
      if (m.content === rawLink.content) isQuick = true;
    });

    let destRoom;
    if (isQuick) destRoom = getChannel("ห้องส่งงานรีบ");
    else destRoom = getChannel("ห้องส่งงานคลีน");

    destRoom.send(rawLink.content);
    destRoom.send(cleanLink.content);
    rawLink.delete();
    cleanLink.delete();
  }
}
module.exports = { sortJobs };

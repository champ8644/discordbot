const { getChannel } = require("../utils/getChannel");
const { send } = require("../utils/send");

const twitterRegex = new RegExp(/twitter\.com\/(.*)\/status\/(\d*)/);
const oneDriveRegex = new RegExp(/payap-my\.sharepoint\.com/);
const gDriveRegex = new RegExp(/drive\.google\.com/);

function parseLinkType(message) {
  if (message.attachments.size > 0) return { type: "file" };
  const twitParse = twitterRegex.exec(message.content);
  if (twitParse) {
    const [, author, post] = twitParse;
    return { type: "twitter", parse: { author, post } };
  }
  if (oneDriveRegex.test(message.content)) return { type: "oneDrive" };
  if (gDriveRegex.test(message.content)) return { type: "gDrive" };
  return { type: null };
}

async function checkAtChannel(parseLink, getChannel, shouldDelete) {
  const channel = await getChannel;
  const messages = await channel.messages.fetch();
  for (let value of messages.values()) {
    const twitParse = twitterRegex.exec(value.content);
    if (twitParse) {
      const [, author, post] = twitParse;
      if (parseLink.author === author && parseLink.post === post) {
        if (shouldDelete) value.delete();
        return true;
      }
    }
  }
}

async function checkQuick(parseLink) {
  const finalPromise = await Promise.all([
    checkAtChannel(parseLink, getChannel("ห้องงานรีบใหม่")),
    checkAtChannel(parseLink, getChannel("ห้องคอมมิคใหม่")),
    checkAtChannel(parseLink, getChannel("งานรีบกำลังคลีน"), true),
  ]);
  const finalAnswer = finalPromise.reduce(
    (state, next) => state || next,
    false
  );
  return finalAnswer;
}

async function sortJobs(message) {
  const latestLink = parseLinkType(message);
  if (latestLink.type) {
    const messages = await message.channel.messages.fetch({ limit: 2 });
    if (!latestLink.type) return;
    if (messages.length < 2) return;
    const iterator = messages.values();
    iterator.next();
    const message2 = iterator.next().value;
    const secondLink = parseLinkType(message2);
    if (!secondLink.type) return;
    let rawLink;
    let parseLink;
    let cleanLink;
    if (latestLink.type === "twitter" && secondLink.type !== "twitter") {
      rawLink = message;
      parseLink = latestLink.parse;
      cleanLink = message2;
    } else if (latestLink.type !== "twitter" && secondLink.type === "twitter") {
      rawLink = message2;
      parseLink = secondLink.parse;
      cleanLink = message;
    } else return;

    const isQuick = await checkQuick(parseLink);

    let destRoom;
    if (isQuick) destRoom = await getChannel("ห้องส่งงานรีบ");
    else destRoom = await getChannel("ห้องส่งงานคลีน");

    send(destRoom, rawLink, {
      shouldDelete: true,
    });
    send(destRoom, cleanLink, {
      shouldDelete: true,
    });
  }
}
module.exports = { sortJobs };
const { onError } = require("../utils/errorHandle");
const { getChannel } = require("../utils/getChannel");
const { send } = require("../utils/send");

const twitterRegex = new RegExp(/twitter\.com\/(.*)\/status\/(\d*)/);
const oneDriveRegex = new RegExp(/payap-my\.sharepoint\.com/);
const gDriveRegex = new RegExp(/drive\.google\.com/);

function parseLinkType(message) {
  if (!message) return { type: null };
  if (message.attachments && message.attachments.size > 0)
    return { type: "file" };
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
  try {
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
  } catch (error) {
    onError(error, { parseLink, getChannel, shouldDelete });
  }
}

async function checkQuick(parseLink) {
  try {
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
  } catch (error) {
    onError(error, { parseLink });
  }
}

const onGoingMessage = {};

async function sortJobs(message) {
  try {
    const latestLink = parseLinkType(message);
    if (!latestLink.type) return;
    if (onGoingMessage[message.id]) return;
    onGoingMessage[message.id] = 1;
    const messagesFetch = await message.channel.messages.fetch({
      limit: 1,
      before: message.id,
    });
    if (!latestLink.type) return;
    if (messagesFetch.length === 0) return;
    const iterator = messagesFetch.values();
    const message2 = iterator.next().value;
    const secondLink = parseLinkType(message2);
    if (!secondLink.type) {
      delete onGoingMessage[message.id];
      return;
    }
    if (onGoingMessage[message2.id]) return;
    onGoingMessage[message2.id] = true;
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

    await send(destRoom, rawLink, {
      shouldDelete: true,
    });
    await send(destRoom, cleanLink, {
      shouldDelete: true,
    });
    delete onGoingMessage[rawLink.id];
    delete onGoingMessage[cleanLink.id];
  } catch (error) {
    onError(error, { message });
  }
}
module.exports = { sortJobs, parseLinkType };

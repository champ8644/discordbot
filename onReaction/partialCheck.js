const { onError } = require("../utils/errorHandle");

async function partialCheck(entities) {
  try {
    if (entities.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await entities.fetch();
      } catch (error) {
        if (entities.message)
          entities.message.channel.send(
            "Something went wrong when fetching the reaction.: ",
            error
          );
        else
          entities.channel.send(
            "Something went wrong when fetching the reaction.: ",
            error
          );
        return;
      }
    }
  } catch (error) {
    onError(error);
  }
}
module.exports = { partialCheck };

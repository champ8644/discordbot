const { send } = require("../utils/send");

function onError(error) {
  console.error(error);
  const sentError = `\`\`\`js
    ${error.stack}\`\`\``;
  const msg = {
    embed: {
      description: sentError,
      timestamp: new Date(),
    },
  };
  send("ห้องหุ่นมิเชล", { content: sentError }, { API: true });
}

function onRejection(reason, promise) {
  send(
    "ห้องหุ่นมิเชล",
    `Unhandled rejection at ${JSON.stringify(
      promise,
      null,
      2
    )} reason: ${JSON.stringify(reason, null, 2)}`
  );
}

module.exports = { onError, onRejection };

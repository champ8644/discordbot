const { send } = require("../utils/send");
const { delay } = require("../functions/delay");

async function moving(arr, room) {
  try {
    const callBack = arr.map((message) => {
      return () => {
        send(room, message, { shouldDelete: true });
      };
    });
    for (let i = 0; i < callBack.length; i++) {
      callBack[i]();
      console.log(`write message ${i + 1}/${callBack.length}`);
      await delay(1100);
    }
  } catch (error) {
    console.error(error);
  }
}
module.exports = { moving };

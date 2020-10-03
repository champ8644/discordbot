async function loopFetch() {
  const arr = [];
  let before;
  let done = false;
  do {
    const messages = await bot.channels.cache
      .get("575697652247822357")
      .messages.fetch({ limit: 10, before });

    await messages.forEach((message) => {
      if (done < 5) {
        if (message.reactions.cache.size > 0) {
          done++;
        } else {
          arr.push(message);
          before = message.id;
        }
      }
    });
    console.log(arr.length);
  } while (done < 5);

  return arr;
}

function delay(t, v) {
  return new Promise(function (fresolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

async function moving(arr, room) {
  const callBack = arr.map((message) => {
    return () => {
      room.send(message.content);
      message.delete();
    };
  });
  for (let i = 0; i < callBack.length; i++) {
    callBack[i]();
    console.log(`write message ${i + 1}/${callBack.length}`);
    await delay(1100);
  }
}
module.exports = { moving, loopFetch };

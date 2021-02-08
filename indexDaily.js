require("dotenv").config();
const { bot } = require("./utils/Discord");
bot.login(process.env.token);

const { generateReport } = require("./birthday/generateReport");
const { onError } = require("./utils/errorHandle");

const { format, addHours, addMinutes, startOfDay } = require("date-fns");

const { send } = require("./utils/send");

const birthdayList = require("./character/birthdayList.json");

const nowThailand = addHours(
  addMinutes(new Date(), new Date().getTimezoneOffset()),
  7
);
const nowJapan = addHours(nowThailand, 2);
const day = startOfDay(addHours(nowJapan, 12));
const keyDate = format(day, "dd/MM");
const todayEvents = birthdayList[keyDate] || [];

bot.on("ready", async () => {
  try {
    const logReport = [];

    todayEvents.forEach((event) => {
      generateReport(event, undefined, logReport);
    });
    console.log("🚀 ~ Today is ", keyDate);
    console.log(
      "🚀 ~ file: indexDaily.js ~ line 28 ~ todayEvents.forEach ~ todayEvents",
      todayEvents
    );

    let eventText;
    if (logReport.length === 0) eventText = "no events.";
    else if (logReport.length === 1) eventText = "1 event.";
    else eventText = logReport.length + " events.";
    send(
      "ห้องหุ่นมิเชล",
      `Today [${format(
        nowThailand,
        "eee d MMMM yyyy, H:mm"
      )}] has ${eventText}`,
      { API: true }
    );

    logReport.forEach((embed) => {
      send("ห้องหุ่นมิเชล", { embed }, { API: true });
    });
    bot.destroy();
  } catch (error) {
    onError(error);
  }
});

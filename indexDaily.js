require("dotenv").config();
const { bot } = require("./utils/Discord");
bot.login(process.env.token);

const { generateReport } = require("./birthday/generateReport");

bot.on("ready", async () => {
  try {
    todayEvents.forEach((event) => {
      generateReport(event);
    });

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
  } catch (error) {
    onError(error);
  }
});

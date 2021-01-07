const { addDays, addHours, addMinutes, format } = require("date-fns");

const birthdayList = require("../character/birthdayList.json");
const characterList = require("../character/BanGDreamChars.json");
const { generateReport } = require("../birthday/generateReport");

function events(channel, query) {
  const nowThailand = addHours(
    addMinutes(new Date(), new Date().getTimezoneOffset()),
    7
  );
  const nowJapan = addHours(nowThailand, 2);
  let day = nowJapan;
  let gatheredEvents = [];
  let count = query;
  while (count > 0) {
    const keyDate = format(day, "dd/MM");
    const todayEvents = (birthdayList[keyDate] || []).filter(
      (event) => event.type === "hbd"
    );
    gatheredEvents = [...gatheredEvents, ...todayEvents];
    count -= todayEvents.length;
    day = addDays(day, 1);
  }
  console.log(
    "🚀 ~ file: events.js ~ line 16 ~ postNextEvent ~ gatheredEvents",
    gatheredEvents
  );
  console.log("🚀 ~ file: events.js ~ line 20 ~ events ~ day", day);
}

function events(channel, query, type) {
  const nowThailand = addHours(
    addMinutes(new Date(), new Date().getTimezoneOffset()),
    7
  );
  const nowJapan = addHours(nowThailand, 2);
  let day = nowJapan;
  let gatheredEvents = [];
  let count = query;
  while (count > 0) {
    const keyDate = format(day, "dd/MM");
    let todayEvents = (birthdayList[keyDate] || []).filter((event) => {
      if (event.type !== "hbd") return false;
      const info = characterList[event.key];
      if (
        info.band === "CHiSPA" ||
        info.band === "Others" ||
        info.band === "Glitter*Green"
      )
        return false;
      if (type === "chara" && event.seiyuu) return false;
      if (type === "seiyuu" && !event.seiyuu) return false;
      return true;
    });
    gatheredEvents = [...gatheredEvents, ...todayEvents];
    count -= todayEvents.length;
    day = addDays(day, 1);
  }
  gatheredEvents.forEach((event) => generateReport(event, channel));
}

module.exports = { events };

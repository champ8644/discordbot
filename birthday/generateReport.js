const Discord = require("discord.js");

const { send } = require("./utils/send");
const {
  format,
  addHours,
  addMinutes,
  startOfDay,
  setMonth,
  setDate,
} = require("date-fns");
const locale = require("date-fns/locale/th");

const birthdayList = require("./character/birthdayList.json");
const characterList = require("./character/BanGDreamChars.json");
const { onError } = require("./utils/errorHandle");

const nowThailand = addHours(
  addMinutes(new Date(), new Date().getTimezoneOffset()),
  7
);
const nowJapan = addHours(nowThailand, 2);
const day = startOfDay(addHours(nowJapan, 12));
const keyDate = format(day, "dd/MM");
const todayEvents = birthdayList[keyDate] || [];

function combineTHJP(th, jp) {
  if (!jp) return th;
  if (!th) return th;
  return `${th} 「${jp}」`;
}

function combineTHJPNewline(th, jp) {
  if (!jp) return th;
  if (!th) return th;
  return `${th}\n「${jp}」`;
}

function combineName(name = "", surname = "") {
  return [name, surname].filter((x) => x).join(" ");
}

function combineNewLine(text1, text2) {
  return [text1, text2].filter((x) => x).join("\n");
}

function makeLink(link) {
  return `[${link}](${link})`;
}

function getFullName(name, surname, name_jp, surname_jp) {
  return combineTHJP(
    combineName(name, surname),
    combineName(surname_jp, name_jp)
  );
}

function getBandText(band) {
  switch (band) {
    case "Poppin'Party":
      return "Poppin'Party <:PopipaLogo:794643844565958677>";
    case "Roselia":
      return "Roselia <:RoseliaLogo:794643844490592316>";
    case "Afterglow":
      return "Afterglow <:AfterglowLogo:794643844317577286>";
    case "Pastel✽Palettes":
      return "Pastel✽Palettes <:PasupareLogo:794643844339728434>";
    case "Hello, Happy World!":
      return "Hello, Happy World! <:HHWLogo:794643844259774515>";
    case "RAISE A SUILEN":
      return "RAISE A SUILEN <:RASLogo:794643845253693480>";
    case "Morfonica":
      return "Morfonica <:MorfonicaLogo:794643844346937374>";
    default:
      return band;
  }
}

const logReport = [];

function genLogReport(name, color, hbd) {
  const embed = new Discord.MessageEmbed();
  embed.setColor(color);
  if (hbd) embed.setTitle("HBD to " + name);
  else embed.setTitle("Pre HBD to " + name);
  logReport.push(embed);
}

function genCharReport(info, hbd, channel) {
  const embed = new Discord.MessageEmbed();

  const fullname = getFullName(
    info.name,
    info.surname,
    info.name_jp,
    info.surname_jp
  );

  const nickname = combineTHJPNewline(info.nickname, info.nickname_jp);
  const fullnameNewline = combineTHJPNewline(
    combineName(info.name, info.surname),
    combineName(info.surname_jp, info.name_jp)
  );
  const hbdDay = format(
    new Date(2020, info.birthday_month - 1, info.birthday_day),
    "do MMM"
  );

  const hbdText = hbd ? "แฮปปี้เบิร์ดเดย์" : "เตรียม HBD พรุ่งนี้";

  embed.setAuthor("Nep-A-Live Cake Manager", "https://i.imgur.com/K1AWKjQ.jpg");
  embed.setColor(info.colorcode_char);
  embed.setTitle(`${hbdText} ${fullname}`);
  embed.setDescription(
    format(
      setMonth(
        setDate(nowThailand, info.birthday_day),
        info.birthday_month - 1
      ),
      "eeee d MMMM yyyy",
      { locale }
    )
  );
  if (nickname) embed.addField("ชื่อเล่น", nickname, true);
  embed.addField("ชื่อ", fullnameNewline, true);
  embed.addField("วันเกิด", hbdDay, true);
  embed.addField("วง", getBandText(info.band), true);
  embed.addField("ตำแหน่ง", info.role, true);
  if (info.image) embed.setImage(info.image);
  embed.setTimestamp(new Date());

  if (channel) {
    send(channel, { embed }, { API: true });
    return;
  }

  if (hbd) send("ห้องเป่าเค้ก", { embed }, { API: true });

  if (
    !(
      info.band === "CHiSPA" ||
      info.band === "Others" ||
      info.band === "Glitter*Green"
    )
  )
    send("ห้องวันเกิด-ห้องนั่งเล่นรวม", { embed }, { API: true });

  genLogReport(nickname || fullnameNewline, info.colorcode_char, hbd);
}

function genSeiyuuReport(info, hbd, channel) {
  if (!hbd) return;
  const embed = new Discord.MessageEmbed();

  const fullname = getFullName(
    info.s_name,
    info.s_surname,
    info.s_name_jp,
    info.s_surname_jp
  );

  const nickname = combineTHJPNewline(info.s_nickname, info.s_nickname_jp);
  const fullnameNewline = combineTHJPNewline(
    combineName(info.s_name, info.s_surname),
    combineName(info.s_surname_jp, info.s_name_jp)
  );
  const hbdDay = format(
    new Date(2020, info.s_birthday_month - 1, info.s_birthday_day),
    "do MMM"
  );
  const blog = combineNewLine(info.blog1, info.blog2);

  embed.setAuthor(
    "Nep-A-Live Cake Manager - [Seiyuu]",
    "https://i.imgur.com/K1AWKjQ.jpg"
  );
  embed.setColor(info.colorcode_char);
  embed.setTitle(`แฮปปี้เบิร์ดเดย์ ${fullname}`);
  embed.setDescription(
    format(
      setMonth(
        setDate(nowThailand, info.s_birthday_day),
        info.s_birthday_month - 1
      ),
      "eeee d MMMM yyyy",
      { locale }
    )
  );
  if (nickname) embed.addField("ชื่อเล่น", nickname, true);
  embed.addField("ชื่อ", fullnameNewline, true);
  embed.addField("วันเกิด", hbdDay, true);
  embed.addField("วง", getBandText(info.band), true);
  embed.addField("ตำแหน่ง", info.role, true);
  if (info.twitter) embed.addField("Twitter", info.twitter, true);
  if (info.site_instagram)
    embed.addField("Instagram", info.site_instagram, true);
  if (info.site_youtube) embed.addField("Youtube", info.site_youtube, true);
  if (blog) embed.addField("Blog", blog, true);
  if (info.site_other) embed.addField("Other", info.site_other, true);
  if (info.s_image) embed.setImage(info.s_image);
  embed.setTimestamp(new Date());

  if (channel) {
    send(channel, { embed }, { API: true });
    return;
  }

  if (info.band !== "CHiSPA")
    send("ห้องเป่าเค้ก-seiyuu", { embed }, { API: true });

  genLogReport(nickname || fullnameNewline, info.colorcode_char, hbd);
}

function generateReport(event, channel) {
  const info = characterList[event.key];
  const type = event.type === "hbd";
  if (event.seiyuu) genSeiyuuReport(info, type, channel);
  else genCharReport(info, type, channel);
}

module.exports = { generateReport };

const db = require("./BanGDreamChars.json");
const { parse, isValid, format, subDays } = require("date-fns");

function decon(string) {
  const day = Number(string.slice(0, 2));
  const month = Number(string.slice(3, 5));
  return { day, month };
}

function compareObj(_a, _b) {
  const a = decon(_a);
  const b = decon(_b);
  return a.month - b.month || a.day - b.day;
}

function main() {
  const output = {};
  Object.entries(db).forEach(([key, row]) => {
    const {
      graduated,
      birthday_day,
      birthday_month,
      s_birthday_day,
      s_birthday_month,
    } = row;
    if (!graduated) {
      const date = parse(
        `${birthday_day}/${birthday_month}`,
        "dd/MM",
        new Date()
      );
      if (isValid(date)) {
        const text = format(date, "dd/MM");
        const prevText = format(subDays(date, 1), "dd/MM");
        if (!output[prevText]) output[prevText] = [];
        if (!output[text]) output[text] = [];
        output[prevText].push({ key, type: "pre" });
        output[text].push({ key, type: "hbd" });
      }
    }
    const s_date = parse(
      `${s_birthday_day}/${s_birthday_month}`,
      "dd/MM",
      new Date()
    );
    if (isValid(s_date)) {
      const text = format(s_date, "dd/MM");
      const prevText = format(subDays(s_date, 1), "dd/MM");
      if (!output[prevText]) output[prevText] = [];
      if (!output[text]) output[text] = [];
      output[prevText].push({ key, type: "pre", seiyuu: true });
      output[text].push({ key, type: "hbd", seiyuu: true });
    }
  });
  const keys = Object.keys(output).sort(compareObj);
  console.log(
    "🚀 ~ file: generateBirthdayList.js ~ line 38 ~ main ~ keys",
    keys
  );
  const output2 = {};
  keys.forEach((key) => {
    output2[key] = output[key];
  });
  console.log(output2);
}

main();

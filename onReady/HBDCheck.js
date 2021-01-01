const { db } = require("../utils/postgres.js");
const { addHours, isSameDay, format } = require("date-fns");

// function isSameDayInJapan(leftDate, rightDate) {
//   return isSameDay(addHours(leftDate, 2), addHours(rightDate, 2));
// }

function getDateStr(date) {
  return format(date, "dd/MM");
}

function getDateInJapan(date) {
  return addHours(date, 2);
}

async function updateLastLogin(date) {
  const text = "UPDATE meta SET lasthbd = ($1)";
  const values = [getDateStr(date)];
  const res = await db.query(text, values);
  return res?.rowCount;
}

async function getLastLogin() {
  const text = "SELECT lasthbd from meta";
  const res = await db.query(text);
  const { rows } = res;
  const lasthbd = rows && rows[0]?.lasthbd;
  return lasthbd;
}

async function HBDCheck() {
  //   await db.query("INSERT INTO meta(lastlogin) VALUES($1)", [new Date()]);
  const getLastInJapan = await getLastLogin();
  const nowInJapan = getDateInJapan(new Date());
  if (!isSameDay(getLastInJapan, nowInJapan)) {
    await sendHBD();
    await updateLastLogin(nowInJapan);
  }
}

module.exports = { HBDCheck };

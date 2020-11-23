const { db } = require("../utils/postgres.js");
const { subDays } = require("date-fns");

async function updateLastLogin(date) {
  const text = "UPDATE meta SET lastlogin=($1)";
  const values = [date];
  return db.query(text, values);
}

async function getLastLogin() {
  const text = "SELECT lastlogin from meta";
  const res = await db.query(text);
  const { rows } = res;
  const { lastlogin } = rows[0];
  return lastlogin;
}

async function HBDCheck() {
  const get = await getLastLogin();
}

module.exports = { HBDCheck };

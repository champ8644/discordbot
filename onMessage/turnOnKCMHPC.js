const {
  cloudLogin,
  getDeviceInfo,
  listDevicesByType,
  loginDevice,
  turnOn,
} = require("tp-link-tapo-connect");

const TAPO_EMAIL = process.env.TAPO_EMAIL;
const TAPO_PASSWORD = process.env.TAPO_PASSWORD;

async function turnOnKCMHPC() {
  if (!TAPO_EMAIL) throw new Error("No Tapo Email found");
  if (!TAPO_PASSWORD) throw new Error("No Tapo Email found");

  const cloudToken = await cloudLogin(TAPO_EMAIL, TAPO_PASSWORD);

  const devices = await listDevicesByType(cloudToken, "SMART.TAPOPLUG");

  const KCMHPlug = devices.find((device) => device.alias === "KCMH");

  if (!KCMHPlug) throw new Error("No KCMH tapo Plug found");

  const deviceToken = await loginDevice(TAPO_EMAIL, TAPO_PASSWORD, KCMHPlug);

  const { device_on } = await getDeviceInfo(deviceToken);

  if (device_on) {
    console.log("The server is currently already online");
    return "The server is currently already online";
  } else {
    await turnOn(deviceToken);
    console.log("Opening the server, please wait a little bit...");
    return "Opening the server, please wait a little bit...";
  }
}

module.exports = { turnOnKCMHPC };

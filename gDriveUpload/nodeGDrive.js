const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "gDriveUpload/token.json";

class GDrive {
  constructor() {
    this.client_secret = JSON.parse(
      fs.readFileSync("gDriveUpload/client_secret.json")
    );
  }

  async getDrive() {
    if (this.drive) return this.drive;
    const auth = await this.authorize();
    this.drive = google.drive({
      version: "v3",
      auth,
    });
    return this.drive;
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize() {
    return new Promise((resolve) => {
      if (this.OAuth) return resolve(this.OAuth);
      const { client_secret, client_id, redirect_uris } =
        this.client_secret.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return resolve(this.getAccessToken(oAuth2Client));
        oAuth2Client.setCredentials(JSON.parse(token));
        this.OAuth = oAuth2Client;
        resolve(oAuth2Client);
      });
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getAccessToken(oAuth2Client) {
    return new Promise((resolve) => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      console.log("Authorize this app by visiting this url:", authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question("Enter the code from that page here: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error("Error retrieving access token", err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2) => {
            if (err2) return console.error(err2);
            console.log("Token stored to", TOKEN_PATH);
          });
          resolve(oAuth2Client);
        });
      });
    });
  }
}

const gDrive = new GDrive();
export default gDrive;

// /**
//  * Lists the names and IDs of up to 10 files.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listFiles(auth) {
//   const drive = google.drive({ version: "v3", auth });
//   drive.files.list(
//     {
//       pageSize: 10,
//       fields: "nextPageToken, files(id, name)",
//     },
//     (err, res) => {
//       if (err) return console.log(`The API returned an error: ${err}`);
//       const { files } = res.data;
//       if (files.length) {
//         console.log("Files:");
//         files.forEach((file) => {
//           console.log(`${file.name} (${file.id})`);
//         });
//       } else console.log("No files found.");
//     }
//   );
// }

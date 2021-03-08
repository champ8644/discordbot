require("dotenv").config();

// Before running the sample:
// - Enable the API at:
//   https://console.developers.google.com/apis/api/drive.googleapis.com
// - Login into gcloud by running:
//   `$ gcloud auth application-default login`
// - Install the npm module by running:
//   `$ npm install googleapis`

const { google } = require("googleapis");

const drive = google.drive("v3");

async function main() {
  try {
    const auth = new google.auth.GoogleAuth({
      // Scopes can be specified either as an array or as a single, space-delimited string.
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.appdata",
        "https://www.googleapis.com/auth/drive.apps.readonly",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/drive.photos.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    // Acquire an auth client, and bind it to all future calls
    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    // Do the magic
    const res = await drive.files.watch({
      // q: "'1c1RUrGfvObNudqCDA1mzebVnWTH5NVR7' in parents",
      fileId: "11dGSX5LGHr4CS7SuNycc3pYf9J4Aaav8",
    });
    // const res = await drive.changes.getStartPageToken({
      // The ID of the shared drive for which the starting pageToken for listing future changes from that shared drive is returned.
      // driveId: "11dGSX5LGHr4CS7SuNycc3pYf9J4Aaav8",
      // q: "'1c1RUrGfvObNudqCDA1mzebVnWTH5NVR7' in parents",
      // The paths of the fields you want included in the response. If not specified, the response includes a default set of fields
      // specific to this method.For development you can use the special value * to return all fields, but you'll achieve greater
      // performance by only selecting the fields you need.
      // fields: "*",
      // Whether the requesting application supports both My Drives and shared drives.
      // supportsAllDrives: true,
    // });
    // console.log(res.data);

    // const res2 = await drive.changes.watch({
    //   pageToken: res.data.startPageToken,
    // });
    // console.log("🚀 ~ file: listen.js ~ line 54 ~ main ~ res2", res2.data);
    // console.log("🚀 ~ file: listen.js ~ line 56 ~ main ~ res2", res2.data);

    // Example response
    // {
    //   &quot;kind&quot;: &quot;my_kind&quot;,
    //   &quot;startPageToken&quot;: &quot;my_startPageToken&quot;
    // }
  } catch (error) {
    console.error(error);
  }
}

main().catch((e) => {
  console.error(e);
  throw e;
});

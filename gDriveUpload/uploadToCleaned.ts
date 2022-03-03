import fs from 'fs';
import path from 'path';

import gDrive from './nodeGDrive';

const mime = {
  psd: "image/photoshop",
  zip: "application/zip",
} as const;

export async function uploadToCleaned(filePath: string): Promise<string> {
  const drive = await gDrive.getDrive();

  const { ext, base } = path.parse(filePath);
  const mimeType = mime[ext as keyof typeof mime];
  const res = await drive.files.create({
    requestBody: {
      name: base,
      mimeType,
      parents: ["1Crdl-OSpVLVW5D3o2j25fQJdW7TAQni6"],
    },
    media: {
      mimeType,
      body: fs.createReadStream(filePath),
    },
  });
  console.log(res.data);
  if (!res.data.id) throw new Error("Uploaded data has no id");
  const { id } = res.data;
  const url = `https://drive.google.com/file/d/${id}`;
  return url;
}

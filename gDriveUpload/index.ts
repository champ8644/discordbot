import archiver from 'archiver';
import bluebird from 'bluebird';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

import { openSingleBook, writeBook } from '../character/xlsx';
import { sendToClean } from './sendToClean';
import { uploadToCleaned } from './uploadToCleaned';

const srcPath = "D:Downloads/20220304";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function main() {
  const dir = fs.readdirSync(srcPath);
  const files = dir.filter((file) => /\.(?:psd|zip)$/.test(file));
  const group = _.groupBy(files, (file) => {
    const res = /^(.*?)(?:-(\d+))?\.(psd|zip)$/.exec(file);
    if (res) {
      const [, name, serial, type] = res;
      return name;
    }
    return null;
  });

  const xlsxPath = path.join(srcPath, "link.xlsx");

  const xlsxLink =
    openSingleBook<{ num: number; link: string; gDriveURL: string }>(xlsxPath);

  bluebird.each(_.entries(group), async ([filename, list]) => {
    const res = /^\d+c(\d+)(?:-\d+)?$/.exec(filename);
    if (!res) throw new Error(`filename invalid! ${filename}`);
    const [, numFile] = res;

    const linkIdx = xlsxLink.findIndex((row) => row.num === Number(numFile));
    if (linkIdx < 0) throw new Error("Cannot find the link in twitter");

    // already processed this row
    if (xlsxLink[linkIdx].gDriveURL) return;

    let gDriveURL: string;
    let outputFilePath: string;

    if (list.includes(`${filename}.zip`)) {
      outputFilePath = path.join(srcPath, `${filename}.zip`);
      // got .zip file
      gDriveURL = await uploadToCleaned(outputFilePath);
    } else if (list.length > 1) {
      outputFilePath = path.join(srcPath, `${filename}.zip`);
      const output = fs.createWriteStream(outputFilePath);

      output.on("close", () => {
        console.log(
          `Making zip file at: ${outputFilePath} (${
            list.length
          } files), ${archive.pointer()} total bytes`
        );
        list.forEach((srcFile) => {
          const srcFilePath = path.join(srcPath, srcFile);
          fs.unlinkSync(srcFilePath);
        });
      });

      const archive = archiver("zip");
      archive.on("error", (err) => {
        throw err;
      });

      archive.pipe(output as any);
      list.forEach((srcFile) => {
        const srcFilePath = path.join(srcPath, srcFile);
        archive.append(fs.createReadStream(srcFilePath), { name: srcFile });
      });
      archive.finalize();

      gDriveURL = await uploadToCleaned(outputFilePath);
      // got .zip file
    } else {
      outputFilePath = path.join(srcPath, `${filename}.psd`);
      // got .psd file
      gDriveURL = await uploadToCleaned(outputFilePath);
    }

    await sendToClean(gDriveURL);
    await sendToClean(xlsxLink[linkIdx].link);
    xlsxLink[linkIdx] = {
      ...xlsxLink[linkIdx],
      gDriveURL,
    };
    writeBook(xlsxPath, xlsxLink);
    console.log(`Finish sending ${filename}`);
    await sleep(5000);
  });
}

main();

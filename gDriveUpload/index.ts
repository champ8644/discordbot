import archiver from 'archiver';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const srcPath = "D:Downloads/20220303";

export function main() {
  const dir = fs.readdirSync(srcPath);
  const psd = dir.filter((file) => /\.psd$/.test(file));
  const group = _.groupBy(psd, (file) => {
    const res = /^(.*?)(?:-(\d+))?\.psd$/.exec(file);
    if (res) {
      const [, name, serial] = res;
      return name;
    }
    return null;
  });
  _.forEach(group, (list, filename) => {
    if (list.length > 1) {
      const outputFilePath = path.join(srcPath, `${filename}.zip`);
      const output = fs.createWriteStream(outputFilePath);

      output.on("close", () => {
        console.log(
          `${outputFilePath} finished (${
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

      archive.pipe(output);
      list.forEach((srcFile) => {
        const srcFilePath = path.join(srcPath, srcFile);
        archive.append(fs.createReadStream(srcFilePath), { name: srcFile });
      });
      archive.finalize();
    }
  });
}

main();

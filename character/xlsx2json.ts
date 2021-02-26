import * as fs from 'fs';

import { openSingleBook } from './xlsx';

export type header = {
  surname: string;
  name: string;
  surname_jp: string;
  name_jp: string;
  nickname?: string;
  nickname_jp?: string;
  band?: string;
  role?: string;
  birthday_day: number;
  birthday_month: number;
  colorcode_char?: string;
  colorcode_band?: string;
  image?: string;
  s_surname?: string;
  s_name?: string;
  s_surname_jp?: string;
  s_name_jp?: string;
  s_nickname?: string;
  s_nickname_jp?: string;
  s_birthday_day?: number;
  s_birthday_month?: number;
  s_birthday_year?: string;
  s_birthday_string?: string;
  s_image?: string;
  twitter?: string;
  blog1?: string;
  blog2?: string;
  site_instagram?: string;
  site_youtube?: string;
  site_other?: string;
  "Notify iPad Record"?: boolean;
  "Notify Member"?: boolean;
  graduated?: boolean;
};

export default function main() {
  const data = openSingleBook<header>("character/Bushitrod Data.xlsx");
  const output: Record<string, header> = {};
  data.forEach((row) => {
    output[[row.name, row.surname].filter((x) => x).join(" ")] = row;
  });
  fs.writeFileSync(
    "character/BanGDreamChars.json",
    JSON.stringify(output, null, 2)
  );
  console.log("finished");
}

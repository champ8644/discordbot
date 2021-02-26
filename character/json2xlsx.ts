import importeddata from './BanGDreamChars.json';
import { writeBook } from './xlsx';

export function main() {
  writeBook("src/testCode/BanGDreamChars.xlsx", Object.values(importeddata), {
    header: [
      "surname",
      "name",
      "surname_jp",
      "name_jp",
      "nickname",
      "nickname_jp",
      "band",
      "role",
      "birthday_day",
      "birthday_month",
      "colorcode_char",
      "colorcode_band",
      "image",
      "s_surname",
      "s_name",
      "s_surname_jp",
      "s_name_jp",
      "s_nickname",
      "s_nickname_jp",
      "s_birthday_day",
      "s_birthday_month",
      "s_birthday_year",
      "s_birthday_string",
      "s_image",
      "twitter",
      "blog1",
      "blog2",
      "site_instagram",
      "site_youtube",
      "site_other",
    ],
  });
}

main();

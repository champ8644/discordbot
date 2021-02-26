import XLSX from 'xlsx';
import XLSXStyle from 'xlsx-style';

export function openBook<T extends boolean>(
  path: string,
  options?: XLSX.ParsingOptions,
  singleWorkbook?: T
): T extends true ? unknown[] : Record<string, unknown[]> {
  const workbook = XLSX.readFile(path, options);
  const outObj: Record<string, unknown[]> = {};
  workbook.SheetNames.forEach((sheetName) => {
    outObj[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  });
  if (singleWorkbook === true) {
    const keys = Object.keys(outObj);
    if (keys.length === 1)
      return outObj[keys[0]] as T extends true
        ? unknown[]
        : Record<string, unknown[]>;
  }
  return outObj as T extends true ? unknown[] : Record<string, unknown[]>;
}

type Cell = { c: number; r: number };
export type Range = { s: Cell; e: Cell };

type aRGBType = string | { a?: number; r?: number; g?: number; b?: number };
export type StyleType = Record<string, any>;

function addHeaderRange(range: Array<Range>) {
  return range.map((each) => ({
    s: {
      c: each.s.c,
      r: each.s.r + 1,
    },
    e: {
      c: each.e.c,
      r: each.e.r + 1,
    },
  }));
}

export function styleBook(
  path: string,
  payload?: {
    title?: string;
    merge?: Array<Range>;
    cols?: Array<number>;
    paint?: Array<{ i: number; j: number; aRGB: aRGBType }>;
    style?: Array<{ i: number; j: number; style: StyleType }>;
  }
) {
  if (!payload) return;
  if (!payload.merge && !payload.cols && !payload.paint && !payload.style)
    return;
  const stylebook = XLSXStyle.readFile(path);
  const stylesheet = payload.title
    ? stylebook.Sheets[payload.title]
    : stylebook.Sheets[stylebook.SheetNames[0]];
  if (payload.merge) stylesheet["!merges"] = addHeaderRange(payload.merge);
  if (payload.cols) {
    const colWidth = [26, 28, 28, 28, 31, 23, 56, 23, 51, 90, 112, 65].map(
      (num) => ({
        wpx: num,
      })
    );
    stylesheet["!cols"] = colWidth;
  }
  if (payload.paint) {
    payload.paint.forEach(({ i, j, aRGB }) => {
      let rgb: string;
      if (typeof aRGB === "string") rgb = aRGB;
      else {
        const { a, r, g, b } = aRGB;
        rgb = `${a === undefined ? "128" : a.toString(16)}${
          r === undefined ? "128" : r.toString(16)
        }${g === undefined ? "128" : g.toString(16)}${
          b === undefined ? "128" : b.toString(16)
        }`;
      }
      const cell = stylesheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })];
      if (cell) cell.s = { ...cell.s, fill: { fgColor: { rgb } } };
    });
  }
  if (payload.style) {
    payload.style.forEach(({ i, j, style }) => {
      const cell = stylesheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })];
      if (cell) cell.s = { ...cell.s, ...style };
    });
  }
  XLSXStyle.writeFile(stylebook, path);
}

export function writeBook(
  path: string,
  _json: Record<string, unknown>[],
  payload?: {
    header?: Array<string>;
    title?: string;
    merge?: Array<Range>;
    cols?: Array<number>;
    paint?: Array<{ i: number; j: number; aRGB: aRGBType }>;
    style?: Array<{ i: number; j: number; style: StyleType }>;
  }
) {
  const { header, title = "Sheet 1" } = payload || {};
  const json: Array<unknown> = header
    ? _json.map((row) => {
        const output: Record<string, unknown> = {};
        header.forEach((key) => {
          if (row[key]) output[key] = row[key];
        });
        return output;
      })
    : _json;
  const worksheet = XLSX.utils.json_to_sheet(json, { header });

  const outputWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(outputWorkbook, worksheet, title);
  XLSX.writeFile(outputWorkbook, path);

  styleBook(path, payload);
}

export function openSingleBook<T>(
  path: string,
  options: XLSX.ParsingOptions = { cellDates: true }
) {
  const workbook = XLSX.readFile(path, options);
  const outObj: Record<string, Array<T>> = {};
  workbook.SheetNames.forEach((sheetName) => {
    outObj[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  });
  const keys = Object.keys(outObj);
  return outObj[keys[0]];
}

const borderStyle = {
  style: "thin",
  color: { auto: 1 },
};

const border = {
  top: borderStyle,
  bottom: borderStyle,
  left: borderStyle,
  right: borderStyle,
};

export const style = {
  header: {
    font: {
      name: "TH SarabunPSK",
      sz: "20",
      bold: true,
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
  },
  subheaderCenter: {
    font: {
      name: "TH SarabunPSK",
      sz: "11",
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
  },
  subheaderLeft: {
    font: {
      name: "TH SarabunPSK",
      sz: "11",
    },
    alignment: {
      vertical: "center",
      horizontal: "left",
    },
  },
  cellHeader: {
    font: {
      name: "TH SarabunPSK",
      sz: "16",
      bold: true,
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
    border,
  },
  cell: {
    font: {
      name: "TH SarabunPSK",
      sz: "16",
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
    border,
  },
  cellLeft: {
    font: {
      name: "TH SarabunPSK",
      sz: "16",
    },
    alignment: {
      vertical: "center",
      horizontal: "left",
    },
    border,
  },
  cellHeader2: {
    font: {
      name: "TH SarabunPSK",
      sz: "16",
      bold: true,
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
    border,
  },
  cell2: {
    font: {
      name: "TH SarabunPSK",
      sz: "14",
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
    border,
  },
  cellLeft2: {
    font: {
      name: "TH SarabunPSK",
      sz: "14",
    },
    alignment: {
      vertical: "center",
      horizontal: "left",
    },
    border,
  },
  cellLarge2: {
    font: {
      name: "TH SarabunPSK",
      sz: "48",
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
    border,
  },
};

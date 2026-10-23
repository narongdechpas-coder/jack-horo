// Generates src/lib/systems/iching/hexagrams.data.ts from the CC0 dataset
// https://github.com/HeTaobaba123/iching-64-hexagrams-dataset (iching-64-hexagrams.zh.json)
// Only structural facts and the classical Chinese judgment (卦辭) are kept; the English text is not used.
// Usage: node scripts/build-iching-data.mjs <path to iching-64-hexagrams.zh.json>
import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(process.argv[2], "utf8"));
const list = Array.isArray(raw) ? raw : raw.hexagrams ?? Object.values(raw);
const rows = list
  .sort((a, b) => a.number - b.number)
  .map((h) => {
    const upper = h.upper_trigram.replace(/[☰-☷]/g, "");
    const lower = h.lower_trigram.replace(/[☰-☷]/g, "");
    return `  [${h.number}, ${JSON.stringify(h.chinese)}, ${JSON.stringify(h.pinyin)}, ${JSON.stringify(upper)}, ${JSON.stringify(lower)}, ${JSON.stringify(h.judgment)}],`;
  });
const out = `// สร้างโดย scripts/build-iching-data.mjs จาก dataset CC0 (HeTaobaba123/iching-64-hexagrams-dataset)
// [เลข King Wen, ชื่อจีน, pinyin, ตรีแกรมบน, ตรีแกรมล่าง, คำตัดสิน 卦辭]
export const HEXAGRAM_ROWS: [number, string, string, string, string, string][] = [
${rows.join("\n")}
];
`;
writeFileSync("src/lib/systems/iching/hexagrams.data.ts", out);
console.log("wrote", rows.length, "hexagrams");

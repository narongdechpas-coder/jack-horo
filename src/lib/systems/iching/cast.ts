// การโยนเหรียญและการอ่านฉากอี้จิง
// วิธีเหรียญ 3 เหรียญ: หัว = 3, ก้อย = 2 ผลรวม 6 = หยินเปลี่ยน, 7 = หยาง, 8 = หยิน, 9 = หยางเปลี่ยน
// เส้นเรียงจากล่าง (เส้นที่ 1) ขึ้นบน (เส้นที่ 6)

import { HEXAGRAM_ROWS } from "./hexagrams.data";
import { HEXAGRAM_LORE, type HexagramLore } from "./lore";
import { trigramByLines, trigramByZh, type Trigram } from "./trigrams";

export type LineValue = 6 | 7 | 8 | 9;

export interface Hexagram {
  number: number;
  zh: string;
  pinyin: string;
  upper: Trigram;
  lower: Trigram;
  judgment: string;
  /** เส้นจากล่างขึ้นบน 1 = หยาง, 0 = หยิน */
  lines: number[];
  lore: HexagramLore;
}

export const HEXAGRAMS: Hexagram[] = HEXAGRAM_ROWS.map(([number, zh, pinyin, up, low, judgment]) => {
  const upper = trigramByZh(up);
  const lower = trigramByZh(low);
  return { number, zh, pinyin, upper, lower, judgment, lines: [...lower.lines, ...upper.lines], lore: HEXAGRAM_LORE[number - 1] };
});

export function hexagramOf(lines: number[]): Hexagram {
  const lower = trigramByLines(lines.slice(0, 3));
  const upper = trigramByLines(lines.slice(3, 6));
  return HEXAGRAMS.find((h) => h.lower === lower && h.upper === upper)!;
}

/** ค่าของเหรียญ 3 เหรียญ (true = หัว) */
export const coinsToLine = (coins: boolean[]): LineValue => coins.reduce<number>((s, h) => s + (h ? 3 : 2), 0) as LineValue;

/** โยนเหรียญ 3 เหรียญด้วยตัวสุ่มที่ปลอดภัยของเบราว์เซอร์ */
export function tossCoins(): boolean[] {
  const buf = new Uint8Array(3);
  crypto.getRandomValues(buf);
  return [...buf].map((b) => (b & 1) === 1);
}

export const isYang = (v: LineValue) => v === 7 || v === 9;
export const isChanging = (v: LineValue) => v === 6 || v === 9;

export interface IChingReading {
  question: string;
  values: LineValue[];
  primary: Hexagram;
  /** ตำแหน่งเส้นที่เปลี่ยน 1–6 */
  changing: number[];
  /** ฉากผลลัพธ์ (ไม่มีถ้าไม่มีเส้นเปลี่ยน) */
  result: Hexagram | null;
}

export function readIChing(values: LineValue[], question = ""): IChingReading {
  const primary = hexagramOf(values.map((v) => (isYang(v) ? 1 : 0)));
  const changing = values.flatMap((v, i) => (isChanging(v) ? [i + 1] : []));
  const result = changing.length ? hexagramOf(values.map((v) => (isYang(v) !== isChanging(v) ? 1 : 0))) : null;
  return { question, values, primary, changing, result };
}

/** อ่านเส้นจากลิงก์ ?l=789868 (ล่างขึ้นบน) */
export function parseLines(l: string | null): LineValue[] | null {
  if (!l || !/^[6-9]{6}$/.test(l)) return null;
  return [...l].map(Number) as LineValue[];
}

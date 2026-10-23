// เลขศาสตร์แบบพีทาโกรัส (Pythagorean numerology)
// - ลดตัวเลขด้วยการบวกหลักจนเหลือ 1–9 ยกเว้นเลขมาสเตอร์ 11 22 33
// - เลขเส้นทางชีวิต: ลดเดือน วัน ปี แยกกันก่อน แล้วรวมและลดอีกครั้ง (วิธีที่ช่วยรักษาเลขมาสเตอร์)
// - ตัวอักษร A–Z ใช้ตารางพีทาโกรัส A=1 … I=9, J=1 … R=9, S=1 … Z=8
//   (ตารางนี้แพร่หลายจาก L. Dow Balliett, The Philosophy of Numbers, 1908 ซึ่งเป็นสาธารณสมบัติ)

export const MASTER_NUMBERS = [11, 22, 33] as const;
/** เลขกรรม: ผลรวมระหว่างทางที่เป็น 13 14 16 19 */
export const KARMIC_DEBT = [13, 14, 16, 19] as const;

const digitSum = (n: number) => [...String(n)].reduce((s, d) => s + Number(d), 0);

/** ลดตัวเลขจนเหลือหลักเดียว (หรือเลขมาสเตอร์ถ้า keepMaster) */
export function reduce(n: number, keepMaster = true): number {
  let x = n;
  while (x > 9 && !(keepMaster && (MASTER_NUMBERS as readonly number[]).includes(x))) x = digitSum(x);
  return x;
}

/** ลดตัวเลขทีละขั้น แล้วดูว่าผ่านเลขกรรมหรือไม่ */
function karmicIn(n: number): number | null {
  let x = n;
  while (x > 9) {
    if ((KARMIC_DEBT as readonly number[]).includes(x)) return x;
    x = digitSum(x);
  }
  return null;
}

export interface CoreNumbers {
  lifePath: number;
  /** ผลรวมก่อนลดรอบสุดท้าย เช่น 29/11 */
  lifePathCompound: number;
  birthday: number;
  /** เลขกรรมที่พบในเส้นทางชีวิตหรือวันเกิด */
  karmicDebt: number[];
}

export function coreNumbers(year: number, month: number, day: number): CoreNumbers {
  const compound = reduce(month) + reduce(day) + reduce(year);
  const karmic = [karmicIn(compound), karmicIn(day)].filter((k): k is number => k !== null);
  return {
    lifePath: reduce(compound),
    lifePathCompound: compound,
    birthday: reduce(day),
    karmicDebt: [...new Set(karmic)],
  };
}

/** เลขปีส่วนตัว (1–9) ของปี ค.ศ. `year` นับตามวันเกิด */
export const personalYear = (month: number, day: number, year: number) => reduce(reduce(month, false) + reduce(day, false) + reduce(year, false), false);

/** เลขเดือนส่วนตัว (1–9) */
export const personalMonth = (pYear: number, month: number) => reduce(pYear + month, false);

const LETTER_VALUE = (ch: string) => ((ch.charCodeAt(0) - 65) % 9) + 1;
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export interface NameNumbers {
  /** ชื่อที่ใช้คำนวณ (เฉพาะตัวอักษร A–Z) */
  letters: string;
  /** เลขชะตาจากชื่อเต็ม: พรสวรรค์และศักยภาพ */
  expression: number;
  /** เลขจิตวิญญาณจากสระ: สิ่งที่ใจปรารถนา */
  soulUrge: number;
  /** เลขบุคลิกจากพยัญชนะ: ภาพที่คนอื่นเห็น */
  personality: number;
}

/** คำนวณจากชื่อภาษาอังกฤษ (เช่น ตามพาสปอร์ต) คืน null ถ้าไม่มีตัวอักษร A–Z */
export function nameNumbers(name: string): NameNumbers | null {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "");
  if (!letters) return null;
  const sum = (filter: (c: string) => boolean) => [...letters].filter(filter).reduce((s, c) => s + LETTER_VALUE(c), 0);
  const vowels = sum((c) => VOWELS.has(c));
  const consonants = sum((c) => !VOWELS.has(c));
  return {
    letters,
    expression: reduce(vowels + consonants),
    soulUrge: vowels ? reduce(vowels) : 0,
    personality: consonants ? reduce(consonants) : 0,
  };
}

export function isValidDate(year: number, month: number, day: number): boolean {
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

import { QUESTIONS, SYMBOLS, TONES, type OracleSymbol } from "./data";

export const LINES = 5;

/** แต่ละบรรทัด: จำนวนขีดคี่ = 1 คู่ = 0 */
export function linesToBits(counts: number[]): number[] {
  return counts.map((c) => (c % 2 === 1 ? 1 : 0));
}

/** อ่าน 5 บิตเป็นเลขฐานสอง (บรรทัดแรกเป็นหลักที่มีค่ามากที่สุด) ได้ลำดับสัญลักษณ์ 0–31 */
export function oracleIndex(counts: number[]): number {
  return linesToBits(counts).reduce((acc, b) => acc * 2 + b, 0);
}

export interface OracleReading {
  question: string;
  counts: number[];
  bits: number[];
  symbol: OracleSymbol;
  toneLabel: string;
  guide: string;
}

export function readOracle(questionIndex: number, counts: number[]): OracleReading {
  const symbol = SYMBOLS[oracleIndex(counts)];
  const tone = TONES[symbol.tone];
  return {
    question: QUESTIONS[questionIndex],
    counts,
    bits: linesToBits(counts),
    symbol,
    toneLabel: tone.label,
    guide: tone.guide,
  };
}

/** อ่านผลจากลิงก์ ?q=3&c=5,2,7,4,9 คืน null ถ้าข้อมูลไม่ครบหรือไม่ถูกต้อง */
export function parseOracleParams(q: string | null, c: string | null): { questionIndex: number; counts: number[] } | null {
  if (q == null || c == null) return null;
  const questionIndex = Number(q);
  const counts = c.split(",").map(Number);
  const ok =
    Number.isInteger(questionIndex) && questionIndex >= 0 && questionIndex < QUESTIONS.length &&
    counts.length === LINES && counts.every((n) => Number.isInteger(n) && n >= 1 && n <= 999);
  return ok ? { questionIndex, counts } : null;
}

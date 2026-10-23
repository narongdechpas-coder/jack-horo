// ตรีแกรม 8 แบบ (八卦) เส้นเรียงจากล่างขึ้นบน: 1 = หยาง (เส้นเต็ม), 0 = หยิน (เส้นขาด)

export interface Trigram {
  /** ชื่อจีนแบบตัวย่อ ตรงกับ hexagrams.data.ts */
  zh: string;
  symbol: string;
  /** ภาพธรรมชาติ */
  th: string;
  reading: string;
  lines: [number, number, number];
  nature: string;
  family: string;
}

export const TRIGRAMS: Trigram[] = [
  { zh: "乾", symbol: "☰", th: "ฟ้า", reading: "เฉียน", lines: [1, 1, 1], nature: "แข็งแกร่ง สร้างสรรค์ เป็นผู้นำ", family: "พ่อ" },
  { zh: "兑", symbol: "☱", th: "บึง", reading: "ตุ้ย", lines: [1, 1, 0], nature: "ร่าเริง ยินดี การพูดคุย", family: "ลูกสาวคนเล็ก" },
  { zh: "离", symbol: "☲", th: "ไฟ", reading: "หลี", lines: [1, 0, 1], nature: "ความสว่าง ความชัดเจน การยึดเกาะ", family: "ลูกสาวคนกลาง" },
  { zh: "震", symbol: "☳", th: "ฟ้าร้อง", reading: "เจิ้น", lines: [1, 0, 0], nature: "การเริ่มต้น การเคลื่อนไหว ความตื่นตัว", family: "ลูกชายคนโต" },
  { zh: "巽", symbol: "☴", th: "ลม", reading: "ซวิ่น", lines: [0, 1, 1], nature: "อ่อนโยน ค่อย ๆ แทรกซึม ยืดหยุ่น", family: "ลูกสาวคนโต" },
  { zh: "坎", symbol: "☵", th: "น้ำ", reading: "ขั่น", lines: [0, 1, 0], nature: "อันตราย ความลึก การไหลผ่านอุปสรรค", family: "ลูกชายคนกลาง" },
  { zh: "艮", symbol: "☶", th: "ภูเขา", reading: "เกิ้น", lines: [0, 0, 1], nature: "หยุดนิ่ง สงบ รู้จักพอ", family: "ลูกชายคนเล็ก" },
  { zh: "坤", symbol: "☷", th: "ดิน", reading: "คุน", lines: [0, 0, 0], nature: "รองรับ อ่อนโยน อดทน", family: "แม่" },
];

export const trigramByZh = (zh: string) => TRIGRAMS.find((t) => t.zh === zh)!;
export const trigramByLines = (l: number[]) => TRIGRAMS.find((t) => t.lines.every((v, i) => v === l[i]))!;

// ส่วนกลางของคลังความรู้: ชนิดข้อมูลของ "ไพ่ที่อ่านร่วมกัน" แหล่งอ้างอิง และการเดาหัวข้อจากคำถาม
// ใช้ร่วมกันระหว่างไพ่ยิปซีกับไพ่ป๊อก

export type ComboSource = "book-t" | "modern" | "cartomancy";

export const SOURCE_LABEL: Record<ComboSource, string> = {
  "book-t": "ตำรา Book T ของ Golden Dawn (1888)",
  modern: "แนวตีความที่นักอ่านไพ่ใช้กันทั่วไป",
  cartomancy: "แนวดูไพ่ป๊อกที่ใช้กันทั่วไป",
};

/** ความหมายที่เกิดจากไพ่หลายใบอ่านร่วมกัน */
export interface Combo {
  title: string;
  text: string;
  source: ComboSource;
}

export type Topic = "love" | "work" | "general";

export const TOPIC_LABEL: Record<Topic, string> = { love: "ความรัก", work: "การงานและการเงิน", general: "เรื่องทั่วไป" };

const LOVE_WORDS = ["รัก", "แฟน", "คู่", "จีบ", "แต่งงาน", "สามี", "ภรรยา", "ความสัมพันธ์", "คนคุย", "เลิก", "คืนดี", "แอบชอบ", "หัวใจ", "โสด", "ครอบครัว"];
const WORK_WORDS = ["งาน", "เงิน", "ธุรกิจ", "ลงทุน", "หุ้น", "เรียน", "สอบ", "อาชีพ", "เจ้านาย", "หัวหน้า", "ขาย", "หนี้", "รายได้", "เงินเดือน", "สัมภาษณ์", "โปรเจกต์", "ร้าน", "บริษัท", "การเงิน", "โชคลาภ"];

const count = (q: string, words: string[]) => words.filter((w) => q.includes(w)).length;

/** เดาว่าคำถามเป็นเรื่องความรักหรือการงาน เพื่อเลือกคำอธิบายที่ตรงเรื่อง */
export function detectTopic(question: string): Topic {
  const q = question.trim();
  const love = count(q, LOVE_WORDS);
  const work = count(q, WORK_WORDS);
  if (love > work) return "love";
  if (work > love) return "work";
  return "general";
}

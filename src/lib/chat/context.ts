// แปลงผลดวงของแต่ละศาสตร์เป็นข้อความสั้น ๆ ให้หมอดู AI อ่าน
// ใช้ผลที่หน้าเว็บคำนวณไว้แล้ว ไม่คำนวณใหม่

import type { BaziResult } from "@/lib/systems/bazi/calculate";
import { ELEMENT_INFO } from "@/lib/systems/bazi/names";
import { interpretBazi } from "@/lib/systems/bazi/story";
import type { OracleReading } from "@/lib/systems/oraculum/oracle";
import { CARD_LORE } from "@/lib/systems/playing-cards/lore";
import { TAROT_LORE } from "@/lib/systems/tarot/lore";
import { SOURCE_LABEL, TOPIC_LABEL, detectTopic, type Combo, type Topic } from "@/lib/systems/reading-kb";
import { SUITS } from "@/lib/systems/playing-cards/deck";
import type { SpreadReading } from "@/lib/systems/playing-cards/spreads";
import type { TarotReading } from "@/lib/systems/tarot/spreads";
import type { SevenResult } from "@/lib/systems/thai-seven/calculate";
import { interpretSeven } from "@/lib/systems/thai-seven/story";

const TONE_TH = { good: "ดี", neutral: "กลาง ๆ", caution: "ระวัง" } as const;

const questionLine = (q: string) => `คำถามของผู้ใช้: ${q.trim() || "(ไม่ได้ระบุ ถามเรื่องทั่วไป)"}`;

const topicLine = (t: Topic) => `หัวข้อที่น่าจะถาม (เดาจากคำถาม): ${TOPIC_LABEL[t]}`;

const combosText = (combos: Combo[]) =>
  combos.length
    ? ["ไพ่ที่อ่านร่วมกัน (จากคลังความรู้ของเว็บ):", ...combos.map((c) => `- ${c.title}: ${c.text} [${SOURCE_LABEL[c.source]}]`)]
    : ["ไพ่ที่อ่านร่วมกัน: ไม่มีกฎพิเศษ ให้เชื่อมความหมายตามตำแหน่ง"];

const readingsText = (items: { heading: string; body: string; advice?: string }[]) =>
  items.map((r) => `${r.heading}: ${r.body}${r.advice ? ` (คำแนะนำ: ${r.advice})` : ""}`).join("\n");

export function tarotContext(r: TarotReading, question: string): string {
  const topic = r.spread.id === "love" ? "love" : detectTopic(question);
  return [
    questionLine(question),
    topicLine(topic),
    `รูปแบบการเปิดไพ่: ${r.spread.name} (${r.cards.length} ใบ)`,
    ...r.cards.flatMap(({ position, card, reversed }, i) => {
      const lore = TAROT_LORE[card.id];
      return [
        `${i + 1}. ตำแหน่ง "${position.name}" (${position.hint}): ${card.nameTh} (${card.nameEn})` +
          `${reversed ? " กลับหัว" : " ไพ่ตั้ง"} — ${card.keyword}: ${reversed ? card.reversed : card.upright}`,
        `   ภาพบนไพ่: ${lore.scene}`,
        `   ตำรา Waite 1910: ${lore.waite}`,
        `   ความรัก: ${lore.love} | การงาน/การเงิน: ${lore.work} | คำแนะนำ: ${lore.advice}`,
      ];
    }),
    ...combosText(r.combos),
    `สรุปจากเว็บ: ${r.summary.join(" ")}`,
  ].join("\n");
}

export function playingCardsContext(r: SpreadReading, question: string): string {
  return [
    questionLine(question),
    topicLine(detectTopic(question)),
    `รูปแบบการเปิดไพ่: ${r.spread.name} (${r.cards.length} ใบ)`,
    ...r.cards.flatMap(({ position, card }, i) => {
      const lore = CARD_LORE[card.id];
      return [
        `${i + 1}. ตำแหน่ง "${position}": ${card.rank} ${SUITS[card.suit].name} (โทน${TONE_TH[card.tone]}) — ${card.meaning}`,
        `   ความรัก: ${lore.love} | การงาน/การเงิน: ${lore.work} | คำแนะนำ: ${lore.advice}`,
      ];
    }),
    `ความหมายของดอก: ${Object.values(SUITS).map((s) => `${s.name} = ${s.theme}`).join(", ")}`,
    ...combosText(r.combos),
    `สรุปจากเว็บ: ${r.summary}`,
  ].join("\n");
}

export function oracleContext(r: OracleReading): string {
  return [
    questionLine(r.question),
    `วิธีดู: ตำราพยากรณ์นโปเลียน ผู้ใช้ขีดเส้น 5 บรรทัด จำนวนขีดคี่/คู่ชี้ไปที่สัญลักษณ์ 1 ใน 32 แบบ`,
    `สัญลักษณ์ที่ได้: ${r.symbol.name} (${r.toneLabel})`,
    `คำพยากรณ์: ${r.symbol.verse}`,
    `คำแนะนำ: ${r.guide}`,
  ].join("\n");
}

export function sevenContext(r: SevenResult): string {
  return [
    `วิธีดู: เลข 7 ตัว (โหราศาสตร์ไทย) จากวันเกิด`,
    `เกิดวัน${r.dayName} ${r.lunar.phase} ${r.lunar.kham} ค่ำ ${r.monthName} ปี${r.lunar.naksatrName}`,
    readingsText(interpretSeven(r)),
  ].join("\n");
}

export function baziContext(r: BaziResult): string {
  const el = (e: keyof typeof ELEMENT_INFO) => `ธาตุ${ELEMENT_INFO[e].th}`;
  const current = r.luck?.find((l) => l.current);
  return [
    `วิธีดู: ปาจื้อ (โหราศาสตร์จีน สี่เสาดวงชะตา) จากวันเวลาเกิด`,
    `ธาตุประจำตัว: ${el(r.dayMaster.stem.element)} · ดวง${r.strong ? "แข็ง" : "อ่อน"}`,
    `ธาตุที่ส่งเสริม: ${r.favorable.map(el).join(" ")} · ธาตุที่ควรเลี่ยง: ${r.unfavorable.map(el).join(" ")}`,
    ...(current ? [`ช่วงชีวิต 10 ปีปัจจุบัน: ${current.startYear}–${current.endYear} (${current.favorable ? "ช่วงขาขึ้น" : "ช่วงต้องอดทน"})`] : []),
    readingsText(interpretBazi(r)),
  ].join("\n");
}

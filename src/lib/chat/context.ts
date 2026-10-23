// แปลงผลดวงของแต่ละศาสตร์เป็นข้อความสั้น ๆ ให้หมอดู AI อ่าน
// ใช้ผลที่หน้าเว็บคำนวณไว้แล้ว ไม่คำนวณใหม่

import type { BaziResult } from "@/lib/systems/bazi/calculate";
import { ELEMENT_INFO } from "@/lib/systems/bazi/names";
import { annualBazi, annualContext } from "@/lib/systems/bazi/annual";
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
import { sumLevel } from "@/lib/systems/thai-seven/calculate";
import { PLANET_LORE, READING_PRINCIPLES, YEAR_ROLE_TEXT } from "@/lib/systems/thai-seven/lore";
import { sevenTaksa } from "@/lib/systems/thai-seven/mahataksa";
import { PLANET_NAMES, thaiDate, type Planet } from "@/lib/systems/daily/taksa";

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

const planetLoreText = (p: Planet) => {
  const l = PLANET_LORE[p];
  return `พระ${PLANET_NAMES[p]} (${l.kind}) ดูแล: ${l.rules} | ภาพรวมช่วงนี้: ${l.period} | งาน: ${l.work} | เงิน: ${l.money} | ความรัก: ${l.love} | สุขภาพ: ${l.health} | คำแนะนำ: ${l.advice}`;
};

export function sevenContext(r: SevenResult, today?: Date): string {
  const chart = r.rows.map(
    (row, i) => `แถว ${i + 1}: ` + row.map((c) => `${c.house}${c.negative ? "(ร้าย)" : ""}=${c.value} ${PLANET_NAMES[c.value as Planet]} [${c.meaning}]`).join(" · "),
  );
  const lines = [
    `วิธีดู: เลข 7 ตัว (โหราศาสตร์ไทย) จากวันเกิด`,
    `เกิดวัน${r.dayName} ${r.lunar.phase} ${r.lunar.kham} ค่ำ ${r.monthName} ปี${r.lunar.naksatrName}`,
    "ตารางดวง (ภพ=เลขดาว):",
    ...chart,
    `ผลรวมแต่ละหลัก: ${r.sums.map((s, c) => `หลัก ${c + 1} (${r.rows[0][c].house}/${r.rows[1][c].house}/${r.rows[2][c].house}) = ${s} กำลัง${sumLevel(s)}`).join(" · ")}`,
  ];
  if (today) {
    const t = sevenTaksa(r, today);
    const role = YEAR_ROLE_TEXT[t.role];
    lines.push(
      `วันนี้: ${thaiDate(today)} · อายุ ${t.age} ปี`,
      `มหาทักษา (ดาวเสวยอายุ ตามตำราพรหมชาติ): ตอนนี้พระ${t.current.name}เสวยอายุ ช่วงอายุ ${t.current.startAge}–${t.current.endAge} ปี (พ.ศ. ${t.current.startYear}–${t.current.endYear}) เหลืออีก ${t.yearsLeft} ปี` +
        ` · เป็นภูมิ${t.role}ในทักษาของเจ้าชะตา = ${role.title}: ${role.story}`,
      `ดาวที่เสวยอยู่: ${planetLoreText(t.current.planet)}`,
      `ช่วงถัดไป: พระ${t.next.name} อายุ ${t.next.startAge}–${t.next.endAge} ปี (พ.ศ. ${t.next.startYear}–${t.next.endYear}) ภูมิ${t.nextRole} = ${YEAR_ROLE_TEXT[t.nextRole].title}`,
      `ลำดับช่วงชีวิตทั้งหมด: ${t.periods.map((p) => `${p.name} ${p.startAge}–${p.endAge}`).join(" → ")}`,
    );
  }
  lines.push("หลักการอ่าน (คลังความรู้ของเว็บ):", ...READING_PRINCIPLES.map((p) => `- ${p}`), "คำทำนายจากเว็บ:", readingsText(interpretSeven(r, today)));
  return lines.join("\n");
}

export function baziContext(r: BaziResult, today?: Date): string {
  const el = (e: keyof typeof ELEMENT_INFO) => `ธาตุ${ELEMENT_INFO[e].th}`;
  const current = r.luck?.find((l) => l.current);
  return [
    `วิธีดู: ปาจื้อ (โหราศาสตร์จีน สี่เสาดวงชะตา) จากวันเวลาเกิด`,
    `ธาตุประจำตัว: ${el(r.dayMaster.stem.element)} · ดวง${r.strong ? "แข็ง" : "อ่อน"}`,
    `ธาตุที่ส่งเสริม: ${r.favorable.map(el).join(" ")} · ธาตุที่ควรเลี่ยง: ${r.unfavorable.map(el).join(" ")}`,
    ...(current ? [`ช่วงชีวิต 10 ปีปัจจุบัน: ${current.startYear}–${current.endYear} (${current.favorable ? "ช่วงขาขึ้น" : "ช่วงต้องอดทน"})`] : []),
    ...(today ? [`วันนี้: ${thaiDate(today)}`, annualContext(annualBazi(r, today))] : []),
    readingsText(interpretBazi(r, today)),
  ].join("\n");
}

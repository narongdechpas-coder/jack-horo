// แปลงผลดวงของแต่ละศาสตร์เป็นข้อความสั้น ๆ ให้หมอดู AI อ่าน
// ใช้ผลที่หน้าเว็บคำนวณไว้แล้ว ไม่คำนวณใหม่

import type { BaziResult } from "@/lib/systems/bazi/calculate";
import { ELEMENT_INFO } from "@/lib/systems/bazi/names";
import { annualBazi, annualContext, yearsAhead } from "@/lib/systems/bazi/annual";
import { interpretBazi } from "@/lib/systems/bazi/story";
import type { OracleReading } from "@/lib/systems/oraculum/oracle";
import { ORACULUM_BACKGROUND } from "@/lib/systems/oraculum/lore";
import { PLANET_ORDER, dailyZodiac, yearlyZodiac, type ZodiacChart } from "@/lib/systems/zodiac/chart";
import { ELEMENT_INFO as ZODIAC_ELEMENTS, HOUSES as ZODIAC_HOUSES, MODALITY_INFO, PLANETS, SIGNS } from "@/lib/systems/zodiac/lore";
import { interpretZodiac } from "@/lib/systems/zodiac/story";
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
    `หมวดของคำถาม: ${r.topicLabel}`,
    `ที่มาของตำรา (คลังความรู้ของเว็บ): ${ORACULUM_BACKGROUND}`,
    `สัญลักษณ์ที่ได้: ${r.symbol.name} (${r.toneLabel}) · คำสำคัญ: ${r.lore.keywords}`,
    `คำพยากรณ์: ${r.symbol.verse}`,
    `ความหมายแบบเข้าใจง่าย: ${r.lore.meaning}`,
    `แนวโน้มของคำตอบ: ${r.leaning}`,
    `คำตอบสำหรับคำถามนี้: ${r.answer}`,
    `คำแนะนำ: ${r.lore.advice} (${r.guide})`,
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
    ...(r.luck ? [`ช่วงชีวิต 10 ปีทั้งหมด (ค.ศ.): ${r.luck.map((l) => `${l.startYear}–${l.endYear} ${l.favorable ? "ขาขึ้น" : "ต้องอดทน"}`).join(" → ")}`] : []),
    ...(today
      ? [
          `วันนี้: ${thaiDate(today)}`,
          annualContext(annualBazi(r, today)),
          annualContext(annualBazi(r, yearsAhead(today, 1)), "ดวงปีหน้า"),
          annualContext(annualBazi(r, yearsAhead(today, 2)), "ดวงอีก 2 ปีข้างหน้า"),
        ]
      : []),
    readingsText(interpretBazi(r, today)),
  ].join("\n");
}

export function zodiacContext(c: ZodiacChart, today?: Date): string {
  const sign = (i: number) => SIGNS[i];
  const deg = (d: number) => `${Math.floor(d)}°`;
  const sun = sign(c.planets.sun.sign);
  const lines = [
    "วิธีดู: โหราศาสตร์สากล 12 ราศีแบบ Tropical (ราศีเริ่มที่จุดวสันตวิษุวัต ต่างจากราศีแบบไทยซึ่งเลื่อนไปราว 24 วัน)",
    `เกิดที่: ${c.province.name} · ${c.hasTime ? "รู้เวลาเกิด" : "ไม่รู้เวลาเกิด จึงไม่มีลัคนา"}`,
    "ตำแหน่งดาวกำเนิด:",
    ...PLANET_ORDER.map((p) => {
      const pl = c.planets[p];
      const uncertain = (p === "sun" && c.sunUncertain) || (p === "moon" && c.moonUncertain) ? " (วันนั้นย้ายราศี ยังไม่แน่ชัด)" : "";
      return `- ${PLANETS[p].th} (${PLANETS[p].meaning}): ${sign(pl.sign).th} ${deg(pl.degree)}${uncertain}`;
    }),
    ...(c.ascendant ? [`- ลัคนา (ภาพที่คนอื่นเห็น): ${sign(c.ascendant.sign).th} ${deg(c.ascendant.degree)}`] : []),
    `ราศีดวงอาทิตย์ ${sun.th}: ธาตุ${ZODIAC_ELEMENTS[sun.element].th} · ${MODALITY_INFO[sun.modality].th} · ดาวเจ้าเรือน${PLANETS[sun.ruler].th}`,
    `คลังความรู้ของราศีหลัก: ตัวตน: ${sun.sun} | ความรัก: ${sun.love} | การงาน: ${sun.work}`,
    `ดวงจันทร์${sign(c.planets.moon.sign).th}: ${sign(c.planets.moon.sign).moon}`,
    ...(c.ascendant ? [`ลัคนา${sign(c.ascendant.sign).th}: ${sign(c.ascendant.sign).rising}`] : []),
  ];
  if (today) {
    const d = dailyZodiac(c.planets.sun.sign, today);
    lines.push(
      `วันนี้: ${thaiDate(today)}`,
      `ดวงวันนี้ (ดวงจันทร์จรนับจากราศีดวงอาทิตย์): ดวงจันทร์อยู่${sign(d.moonSign).th} = เรือนที่ ${d.house + 1} (${ZODIAC_HOUSES[d.house]}) · ${d.story} · คำแนะนำ: ${d.advice}`,
    );
    for (const [label, ahead] of [["ช่วงปีนี้", 0], ["ปีหน้า (ราวเดือนเดียวกันของปีหน้า)", 1]] as const) {
      const y = yearlyZodiac(c.planets.sun.sign, new Date(today.getFullYear() + ahead, today.getMonth(), today.getDate()));
      lines.push(
        `ดวง${label}: ดาวพฤหัสบดีจร${sign(y.jupiterSign).th} = เรือนที่ ${y.jupiterHouse + 1} (${ZODIAC_HOUSES[y.jupiterHouse]}): ${y.jupiter}` +
          ` · ดาวเสาร์จร${sign(y.saturnSign).th} = เรือนที่ ${y.saturnHouse + 1} (${ZODIAC_HOUSES[y.saturnHouse]}): ${y.saturn}`,
      );
    }
  }
  lines.push("คำทำนายจากเว็บ:", readingsText(interpretZodiac(c, today)));
  return lines.join("\n");
}

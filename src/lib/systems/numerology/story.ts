// คำทำนายเลขศาสตร์แบบเล่าเรื่อง จากผลคำนวณและคลังความรู้ (ไม่ใช้ AI)

import { coreNumbers, nameNumbers, personalYear, thaiNameNumbers, type CoreNumbers, type NameNumbers, type ThaiNameNumbers } from "./calc";
import { KARMIC_LORE, NUMBER_LORE, PERSONAL_YEAR } from "./lore";

export interface NumerologyInput {
  year: number;
  month: number;
  day: number;
  /** ชื่อภาษาอังกฤษ (ไม่บังคับ) */
  name?: string;
  /** ชื่อ-นามสกุลภาษาไทย (ไม่บังคับ) */
  thaiName?: string;
}

export interface NumerologyResult {
  input: NumerologyInput;
  core: CoreNumbers;
  name: NameNumbers | null;
  thaiName: ThaiNameNumbers | null;
}

export function calculateNumerology(input: NumerologyInput): NumerologyResult {
  return {
    input,
    core: coreNumbers(input.year, input.month, input.day),
    name: input.name ? nameNumbers(input.name) : null,
    thaiName: input.thaiName ? thaiNameNumbers(input.thaiName) : null,
  };
}

export interface Reading {
  heading: string;
  body: string;
  advice?: string;
}

const label = (n: number) => (n > 9 ? `${n} (เลขมาสเตอร์)` : String(n));

/** ปีส่วนตัวของปี ค.ศ. นี้ (เปลี่ยนทุก 1 มกราคม ตามวิธีที่นิยม) */
export const personalYearOf = (r: NumerologyResult, year: number) => personalYear(r.input.month, r.input.day, year);

export function interpretNumerology(r: NumerologyResult, today?: Date): Reading[] {
  const lp = NUMBER_LORE[r.core.lifePath];
  const bd = NUMBER_LORE[r.core.birthday];
  const readings: Reading[] = [
    {
      heading: `เลขเส้นทางชีวิต ${label(r.core.lifePath)}: ${lp.keyword}`,
      body: `${lp.core} (คำนวณจากผลรวม ${r.core.lifePathCompound}/${r.core.lifePath})`,
      advice: lp.advice,
    },
    { heading: `เลขวันเกิด ${label(r.core.birthday)}: พรสวรรค์ติดตัว`, body: `คุณมีพรสวรรค์ของ${bd.keyword} ${bd.core}` },
    { heading: "ความรัก", body: lp.love },
    { heading: "การงาน", body: lp.work },
    { heading: "สิ่งที่ต้องระวัง", body: lp.challenge, advice: lp.advice },
  ];

  if (r.core.karmicDebt.length) {
    readings.push({
      heading: `เลขกรรม ${r.core.karmicDebt.join(", ")}`,
      body: r.core.karmicDebt.map((k) => KARMIC_LORE[k]).join(" "),
      advice: "มองบทเรียนนี้เป็นโอกาสเติบโต ไม่ใช่โชคร้าย",
    });
  }

  if (r.name) {
    const e = NUMBER_LORE[r.name.expression];
    const s = r.name.soulUrge ? NUMBER_LORE[r.name.soulUrge] : null;
    const p = r.name.personality ? NUMBER_LORE[r.name.personality] : null;
    readings.push({
      heading: `เลขจากชื่อ ${r.input.name}`,
      body:
        `เลขชะตา ${label(r.name.expression)} (${e.keyword}): ชื่อนี้ส่งเสริมพรสวรรค์ด้าน${e.work.replace(/^เหมาะกับ/, "")}` +
        (s ? ` · เลขจิตวิญญาณ ${label(r.name.soulUrge)}: ลึก ๆ ใจคุณปรารถนาการเป็น${s.keyword}` : "") +
        (p ? ` · เลขบุคลิก ${label(r.name.personality)}: คนอื่นมองคุณเป็น${p.keyword}` : ""),
      advice:
        r.name.expression === r.core.lifePath
          ? "เลขชื่อตรงกับเลขเส้นทางชีวิต ชื่อนี้ช่วยเสริมเส้นทางของคุณได้ดีมาก"
          : "ใช้จุดแข็งของเลขชื่อช่วยเสริมเส้นทางชีวิตของคุณ",
    });
  }

  if (r.thaiName) {
    const t = r.thaiName;
    const l = NUMBER_LORE[t.reduced];
    const parts = t.words.map((w, i) => `${i === 0 ? "ชื่อ" : "นามสกุล"} "${w.word}" = ${w.total}`).join(" · ");
    readings.push({
      heading: `เลขศาสตร์ชื่อไทย: ผลรวม ${t.total}`,
      body:
        `${parts} รวมเป็น ${t.total} ลดเหลือ ${label(t.reduced)} (${l.keyword}) ชื่อนี้ส่งพลังด้าน${l.work.replace(/^เหมาะกับ/, "")}` +
        (t.reduced === r.core.lifePath ? " และตรงกับเลขเส้นทางชีวิต ถือว่าชื่อเสริมดวงได้ดี" : "") +
        (t.skipped.length ? ` (ตัว ${t.skipped.join(" ")} ไม่มีในตารางจึงไม่ได้นับ)` : ""),
      advice: "ใช้ตารางค่าอักษรไทยแบบที่นิยมที่สุด แต่ละสำนักอาจให้ค่าต่างกันเล็กน้อย หากจะเปลี่ยนชื่อควรปรึกษาผู้เชี่ยวชาญด้วย",
    });
  }

  if (today) {
    const y = today.getFullYear();
    const now = PERSONAL_YEAR[personalYearOf(r, y)];
    const next = PERSONAL_YEAR[personalYearOf(r, y + 1)];
    readings.push({
      heading: `ปีส่วนตัว ${personalYearOf(r, y)} (ปี ${y + 543}): ${now.theme}`,
      body: `${now.story} ปีหน้า (${y + 544}) จะเป็นปีส่วนตัว ${personalYearOf(r, y + 1)}: ${next.theme}`,
      advice: now.advice,
    });
  }
  return readings;
}

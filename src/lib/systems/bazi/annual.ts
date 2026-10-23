// ดวงปาจื้อรายปี (流年): เทียบเสาปีของปีปัจจุบันกับดวงกำเนิด
//
// หลักปาจื้อมาตรฐาน:
//   - ปีใหม่ของปาจื้อเริ่มที่วันลี่ชุน (立春) ราว 4 กุมภาพันธ์ ไม่ใช่ 1 มกราคมหรือตรุษจีน
//   - ก้านฟ้าของปีเทียบกับธาตุประจำตัวเป็นเทพทั้งสิบ (十神) บอกบรรยากาศของปี
//   - ธาตุของปีอยู่ในกลุ่มธาตุที่ส่งเสริมหรือธาตุที่ควรเลี่ยงของดวง
//   - กิ่งดินของปีชง (六冲) หรือจับคู่ (六合) กับกิ่งปีเกิด/กิ่งวันเกิด และปีนักษัตรเดียวกับปีเกิด (本命年)
// ข้อความภาษาไทยเรียบเรียงใหม่ให้อ่านง่าย

import { Solar } from "lunar-typescript";
import { tenGodOf, type BaziResult } from "./calculate";
import { BRANCHES, ELEMENT_INFO, STEMS, TEN_GODS, type BranchInfo, type Element, type StemInfo } from "./names";

/** กิ่งดินที่ชงกัน (ห่างกัน 6 ตำแหน่ง) */
export const CLASH: Record<string, string> = {
  子: "午", 午: "子", 丑: "未", 未: "丑", 寅: "申", 申: "寅",
  卯: "酉", 酉: "卯", 辰: "戌", 戌: "辰", 巳: "亥", 亥: "巳",
};

/** กิ่งดินที่จับคู่ส่งเสริมกัน (六合) */
export const COMBINE: Record<string, string> = {
  子: "丑", 丑: "子", 寅: "亥", 亥: "寅", 卯: "戌", 戌: "卯",
  辰: "酉", 酉: "辰", 巳: "申", 申: "巳", 午: "未", 未: "午",
};

/** บรรยากาศของปีตามเทพทั้งสิบของก้านปี (คีย์ภาษาจีนใช้ภายใน ไม่แสดงบนหน้าเว็บ) */
export const YEAR_TEN_GOD: Record<string, { story: string; advice: string }> = {
  比肩: { story: "ปีนี้เป็นปีของการยืนด้วยตัวเอง มีเพื่อนและพันธมิตรเข้ามา แต่ก็มีคนมาแบ่งผลประโยชน์", advice: "ร่วมมือกับคนที่ไว้ใจได้ และตกลงเรื่องผลประโยชน์ให้ชัดตั้งแต่แรก" },
  劫财: { story: "ปีนี้มีการแข่งขันสูง เงินเข้าเร็วออกเร็ว และอาจเสียทรัพย์เพราะคนใกล้ตัว", advice: "อย่าค้ำประกันหรือให้ยืมเงินก้อนใหญ่ และเก็บเงินสำรองไว้" },
  食神: { story: "ปีนี้เป็นปีที่ได้ใช้ฝีมือและความคิดสร้างสรรค์ ชีวิตมีความสุข กินดีอยู่ดี", advice: "ต่อยอดงานอดิเรกหรือฝีมือให้เป็นรายได้ และดูแลน้ำหนักด้วย" },
  伤官: { story: "ปีนี้ความคิดแรงและอยากเปลี่ยนแปลง มีไอเดียดีแต่ปะทะกับหัวหน้าหรือกฎเกณฑ์ได้ง่าย", advice: "เลือกคำพูดให้นุ่มนวล และใช้ไอเดียกับงานที่ให้อิสระ" },
  偏财: { story: "ปีนี้มีโชคเรื่องเงินนอกงานประจำ มีโอกาสลงทุนหรือรายได้พิเศษเข้ามา", advice: "คว้าโอกาสได้ แต่กำหนดเพดานความเสี่ยงไว้ทุกครั้ง" },
  正财: { story: "ปีนี้รายได้มั่นคงจากความขยัน เป็นปีที่เหมาะกับการเก็บออมและวางแผนการเงิน", advice: "ออมอย่างสม่ำเสมอ และจัดการเรื่องเงินในบ้านให้เป็นระบบ" },
  七杀: { story: "ปีนี้มีแรงกดดันและความท้าทาย งานหนักขึ้น แต่ถ้ารับมือได้จะก้าวกระโดด", advice: "อย่าแบกทุกอย่างคนเดียว ดูแลสุขภาพ และระวังการปะทะกับคนมีอำนาจ" },
  正官: { story: "ปีนี้มีเรื่องตำแหน่งหน้าที่และความรับผิดชอบ มีโอกาสได้รับการยอมรับหรือเลื่อนขั้น", advice: "ทำงานตามระเบียบอย่างตั้งใจ ผู้ใหญ่จะมองเห็นผลงาน" },
  偏印: { story: "ปีนี้เหมาะกับการเรียนรู้เรื่องเฉพาะทาง ใจอยากอยู่กับตัวเองมากขึ้น ความคิดลึกซึ้ง", advice: "ลงเรียนสิ่งที่สนใจ แต่อย่าเก็บตัวจนพลาดโอกาส" },
  正印: { story: "ปีนี้มีผู้ใหญ่คอยเมตตาและสนับสนุน เหมาะกับการเรียน การสอบ และการพักฟื้นพลัง", advice: "ขอคำแนะนำจากผู้ใหญ่ และลงทุนกับการเรียนหรือใบรับรอง" },
};

export interface YearPillar {
  gan: string;
  zhi: string;
  stem: StemInfo;
  branch: BranchInfo;
  /** ปี พ.ศ. ที่ปีปาจื้อนี้เริ่ม (ลี่ชุน) */
  yearBE: number;
}

export interface AnnualBazi {
  pillar: YearPillar;
  tenGod: string;
  stemSupports: boolean | null;
  branchSupports: boolean | null;
  /** กิ่งปีชงกับกิ่งปีเกิด (ปีชง) */
  clashYear: boolean;
  /** กิ่งปีชงกับกิ่งวันเกิด (เรื่องตัวเองและคู่ครอง) */
  clashDay: boolean;
  /** ปีนักษัตรเดียวกับปีเกิด */
  sameAsBirthYear: boolean;
  /** กิ่งปีจับคู่ส่งเสริมกับกิ่งปีเกิดหรือกิ่งวันเกิด */
  combines: boolean;
  tone: "good" | "neutral" | "caution";
}

/** เสาปีปาจื้อของวันที่ `date` (เปลี่ยนปีที่ลี่ชุน) */
export function yearPillarAt(date: Date): YearPillar {
  const ec = Solar.fromYmdHms(date.getFullYear(), date.getMonth() + 1, date.getDate(), 12, 0, 0).getLunar().getEightChar();
  const gz = ec.getYear();
  const beforeLiChun = gz !== Solar.fromYmdHms(date.getFullYear(), 6, 1, 12, 0, 0).getLunar().getEightChar().getYear();
  return { gan: gz[0], zhi: gz[1], stem: STEMS[gz[0]], branch: BRANCHES[gz[1]], yearBE: date.getFullYear() - (beforeLiChun ? 1 : 0) + 543 };
}

/** วันกลางปีปาจื้อถัดไปอีก `ahead` ปี (ใช้ดูดวงปีหน้า) */
export function yearsAhead(today: Date, ahead: number): Date {
  return new Date(yearPillarAt(today).yearBE - 543 + ahead, 5, 1);
}

const supports = (r: BaziResult, e: Element) => (r.favorable.includes(e) ? true : r.unfavorable.includes(e) ? false : null);

export function annualBazi(r: BaziResult, today: Date): AnnualBazi {
  const pillar = yearPillarAt(today);
  const birthYear = r.pillars.find((p) => p.key === "year")!.zhi;
  const birthDay = r.pillars.find((p) => p.key === "day")!.zhi;
  const stemSupports = supports(r, pillar.stem.element);
  const branchSupports = supports(r, pillar.branch.element);
  const clashYear = CLASH[pillar.zhi] === birthYear;
  const clashDay = CLASH[pillar.zhi] === birthDay;
  const combines = COMBINE[pillar.zhi] === birthYear || COMBINE[pillar.zhi] === birthDay;
  const score = (stemSupports ? 1 : stemSupports === false ? -1 : 0) + (branchSupports ? 1 : branchSupports === false ? -1 : 0) + (combines ? 1 : 0) - (clashYear ? 1 : 0) - (clashDay ? 1 : 0);
  return {
    pillar,
    tenGod: tenGodOf(r.dayMaster.stem, pillar.stem),
    stemSupports,
    branchSupports,
    clashYear,
    clashDay,
    sameAsBirthYear: pillar.zhi === birthYear,
    combines,
    tone: score >= 1 ? "good" : score <= -1 ? "caution" : "neutral",
  };
}

const el = (e: Element) => `ธาตุ${ELEMENT_INFO[e].th}`;

/** ชื่อปีแบบไทย เช่น "ปี 2569 ปีมะเมีย ธาตุไฟ" */
export function yearLabel(a: AnnualBazi): string {
  return `ปี ${a.pillar.yearBE} ปี${a.pillar.branch.animal.replace(/ \(.+\)$/, "")} ${el(a.pillar.stem.element)}`;
}

/** สรุปดวงปีเป็นประโยคภาษาธรรมดา (ใช้บนหน้าเว็บ ไม่มีอักษรจีนหรือศัพท์เทคนิค) */
export function annualStory(a: AnnualBazi): { body: string; advice: string } {
  const parts: string[] = [`${yearLabel(a)} (เริ่มนับราว 4 กุมภาพันธ์ตามปฏิทินจีน)`];
  const se = el(a.pillar.stem.element);
  if (a.stemSupports === true) parts.push(`พลังของปีเป็น${se}ซึ่งช่วยเสริมดวงคุณ เรื่องที่ทำจะมีแรงหนุน`);
  else if (a.stemSupports === false) parts.push(`พลังของปีเป็น${se}ซึ่งไม่ค่อยเข้ากับดวงคุณ หลายเรื่องต้องใช้แรงมากกว่าปกติ`);
  parts.push(YEAR_TEN_GOD[a.tenGod].story);
  if (a.clashYear) parts.push("ปีนี้เป็นปีชงกับปีเกิดของคุณ มักมีความเปลี่ยนแปลง การย้ายที่ หรือเรื่องไม่คาดฝัน");
  else if (a.sameAsBirthYear) parts.push("ปีนี้เป็นปีนักษัตรเดียวกับปีเกิด หลายตำราถือเป็นปีที่ต้องระวังเป็นพิเศษ");
  if (a.clashDay) parts.push("ปีนี้กระทบเรื่องส่วนตัวและคู่ครอง ความสัมพันธ์อาจมีการเปลี่ยนแปลง");
  if (a.combines) parts.push("ปีนี้มีพลังที่จับคู่กับดวงคุณ ได้คนช่วยเหลือและโอกาสดี ๆ จากความสัมพันธ์");
  const caution = a.clashYear || a.clashDay || a.sameAsBirthYear;
  const advice = [YEAR_TEN_GOD[a.tenGod].advice, caution ? "ช่วงนี้ไม่ควรตัดสินใจเรื่องใหญ่แบบเร่งรีบ ทำบุญหรือทำสิ่งดีเพื่อความสบายใจ" : ""].filter(Boolean).join(" และ");
  return { body: parts.join(" "), advice };
}

/** ข้อความสำหรับหมอดู AI (ใช้ศัพท์ได้ เพราะ AI จะเล่าให้ผู้ใช้ฟังเอง) */
export function annualContext(a: AnnualBazi, title = "ดวงปีนี้"): string {
  const god = TEN_GODS[a.tenGod];
  const sup = (s: boolean | null) => (s === true ? "ธาตุที่ส่งเสริมดวง" : s === false ? "ธาตุที่ควรเลี่ยง" : "เป็นกลาง");
  return [
    `${title} (流年, เปลี่ยนปีที่ลี่ชุน): ${yearLabel(a)} เสาปี ${a.pillar.gan}${a.pillar.zhi}`,
    `- ก้านปี ${el(a.pillar.stem.element)} (${sup(a.stemSupports)}) · กิ่งปี ${el(a.pillar.branch.element)} (${sup(a.branchSupports)})`,
    `- ก้านปีเทียบธาตุประจำตัว = ${god.th}: ${god.meaning} · บรรยากาศของปี: ${YEAR_TEN_GOD[a.tenGod].story}`,
    `- ปีชงกับปีเกิด: ${a.clashYear ? "ใช่" : "ไม่"} · ชงกับวันเกิด (ตัวเองและคู่ครอง): ${a.clashDay ? "ใช่" : "ไม่"} · ปีนักษัตรเดียวกับปีเกิด: ${a.sameAsBirthYear ? "ใช่" : "ไม่"} · จับคู่ส่งเสริม (六合): ${a.combines ? "ใช่" : "ไม่"}`,
    `- ภาพรวมจากกฎ: ${a.tone === "good" ? "ปีที่เป็นคุณ" : a.tone === "caution" ? "ปีที่ต้องระวัง" : "ปีกลาง ๆ"}`,
  ].join("\n");
}

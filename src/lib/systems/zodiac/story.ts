// คำทำนาย 12 ราศีแบบเล่าเรื่อง สร้างจากผลคำนวณและคลังความรู้ (ไม่ใช้ AI)

import { dailyZodiac, yearlyZodiac, type ZodiacChart } from "./chart";
import { ELEMENT_INFO, HOUSES, MODALITY_INFO, SIGNS } from "./lore";

export interface Reading {
  heading: string;
  body: string;
  advice?: string;
}

const sign = (i: number) => SIGNS[i];

export function interpretZodiac(c: ZodiacChart, today?: Date): Reading[] {
  const sun = sign(c.planets.sun.sign);
  const moon = sign(c.planets.moon.sign);
  const venus = sign(c.planets.venus.sign);
  const mars = sign(c.planets.mars.sign);
  const el = ELEMENT_INFO[sun.element];
  const readings: Reading[] = [];

  readings.push({
    heading: `ตัวตนของคุณ: ${sun.th}`,
    body:
      `${sun.sun} คุณเป็นคนธาตุ${el.th} (${el.nature}) และเป็น${MODALITY_INFO[sun.modality].th} ${MODALITY_INFO[sun.modality].nature}` +
      (c.sunUncertain ? " (วันเกิดของคุณดวงอาทิตย์กำลังย้ายราศี ใส่เวลาเกิดเพื่อให้ได้ราศีที่แน่นอน)" : ""),
    advice: sun.advice,
  });

  readings.push({
    heading: `อารมณ์และจิตใจ: ดวงจันทร์${moon.th}`,
    body: moon.moon + (c.moonUncertain ? " (วันนั้นดวงจันทร์ย้ายราศี ถ้าใส่เวลาเกิดจะได้คำตอบที่แม่นขึ้น)" : ""),
    advice: "สังเกตว่าอะไรทำให้ใจคุณสงบ แล้วให้เวลากับสิ่งนั้นอย่างสม่ำเสมอ",
  });

  if (c.ascendant) {
    const asc = sign(c.ascendant.sign);
    readings.push({ heading: `ภาพที่คนอื่นเห็น: ลัคนา${asc.th}`, body: asc.rising, advice: "ใช้เสน่ห์แรกพบนี้เปิดประตูโอกาส แล้วให้ตัวตนจริงพาคุณไปต่อ" });
  }

  readings.push({
    heading: "ความรัก",
    body: `${sun.love} ดาวศุกร์ของคุณอยู่${venus.th} คุณจึงให้คุณค่ากับความรักแบบ${venus.th.replace("ราศี", "")}: ${venus.love}`,
    advice: `คนที่มักเข้ากันได้ดีคือคนธาตุ${el.goodWith.map((e) => ELEMENT_INFO[e].th).join("และธาตุ")}`,
  });

  readings.push({
    heading: "การงานและเป้าหมาย",
    body: `${sun.work} ดาวอังคารของคุณอยู่${mars.th} เวลาลงมือทำอะไรคุณจะ${ELEMENT_INFO[mars.element].nature}`,
    advice: "เลือกงานที่ได้ใช้จุดแข็งของราศีคุณ แล้วจะเหนื่อยน้อยลงแต่ได้ผลมากขึ้น",
  });

  if (today) {
    const d = dailyZodiac(c.planets.sun.sign, today);
    readings.push({
      heading: "ดวงวันนี้",
      body: `ดวงจันทร์วันนี้อยู่${sign(d.moonSign).th} เป็นเรือนเรื่อง${HOUSES[d.house]}ของ${sun.th} ${d.story}`,
      advice: d.advice,
    });
    const y = yearlyZodiac(c.planets.sun.sign, today);
    readings.push({
      heading: "ดวงช่วงปีนี้",
      body: `ดาวพฤหัสบดีซึ่งเป็นดาวแห่งโชคอยู่${sign(y.jupiterSign).th}: ${y.jupiter} ส่วนดาวเสาร์ซึ่งเป็นดาวแห่งบทเรียนอยู่${sign(y.saturnSign).th}: ${y.saturn}`,
      advice: "ทุ่มแรงกับเรื่องที่ดาวพฤหัสบดีส่งเสริม และอดทนกับเรื่องที่ดาวเสาร์ทดสอบ",
    });
  }

  return readings;
}

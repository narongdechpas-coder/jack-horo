// คำทำนายอี้จิงแบบเล่าเรื่อง จากผลการโยนเหรียญและคลังความรู้ (ไม่ใช้ AI)

import type { Hexagram, IChingReading } from "./cast";
import { LINE_POSITIONS } from "./lore";

export interface Reading {
  heading: string;
  body: string;
  advice?: string;
}

const scene = (h: Hexagram) => `${h.upper.th}อยู่บน${h.lower.th}`;

export function interpretIChing(r: IChingReading): Reading[] {
  const p = r.primary;
  const readings: Reading[] = [
    {
      heading: `สถานการณ์ตอนนี้: ${p.lore.th}`,
      body: `ฉากที่ ${p.number} ภาพคือ${scene(p)} ${p.lore.meaning}`,
      advice: p.lore.advice,
    },
    { heading: "ความรัก", body: p.lore.love },
    { heading: "การงานและการเงิน", body: p.lore.work },
  ];

  if (r.changing.length === 0) {
    readings.push({
      heading: "ไม่มีเส้นเปลี่ยน",
      body: "เหรียญไม่มีเส้นที่กำลังเปลี่ยน สถานการณ์ค่อนข้างนิ่ง คำตอบอยู่ในความหมายของฉากนี้ทั้งหมด",
    });
  } else {
    readings.push({
      heading: "จุดที่กำลังเปลี่ยน",
      body: r.changing.map((n) => `เส้นที่ ${n}: ${LINE_POSITIONS[n - 1]}`).join(" · "),
      advice: "เรื่องที่อยู่ในตำแหน่งเหล่านี้คือจุดที่คุณมีอิทธิพลต่อผลลัพธ์มากที่สุด",
    });
    const res = r.result!;
    readings.push({
      heading: "ทิศทางที่เรื่องกำลังไป",
      body: `เรื่องนี้กำลังเคลื่อนไปสู่ฉากที่ ${res.number} ${res.lore.th} (${scene(res)}) ${res.lore.meaning}`,
      advice: res.lore.advice,
    });
  }
  return readings;
}

import { describe, expect, it } from "vitest";
import { baziContext } from "@/lib/chat/context";
import { LIMITS } from "@/lib/chat/prompt";
import { CLASH, COMBINE, YEAR_TEN_GOD, annualBazi, annualStory, yearPillarAt, yearsAhead } from "./annual";
import { calculateBazi } from "./calculate";
import { TEN_GODS } from "./names";
import { interpretBazi } from "./story";

describe("yearPillarAt", () => {
  it("changes year at ลี่ชุน, not on 1 January", () => {
    expect(yearPillarAt(new Date(2026, 2, 1))).toMatchObject({ gan: "丙", zhi: "午", yearBE: 2569 });
    expect(yearPillarAt(new Date(2026, 1, 2))).toMatchObject({ gan: "乙", zhi: "巳", yearBE: 2568 });
    expect(yearPillarAt(new Date(2026, 0, 15)).zhi).toBe("巳");
  });
});

describe("yearsAhead", () => {
  it("steps by Chinese years, also in January before ลี่ชุน", () => {
    expect(yearPillarAt(yearsAhead(new Date(2026, 9, 23), 1)).zhi).toBe("未");
    // 15 ม.ค. 2026 ยังเป็นปีมะเส็ง (2568) ปีหน้าจึงเป็นปีมะเมีย
    expect(yearPillarAt(yearsAhead(new Date(2026, 0, 15), 1)).zhi).toBe("午");
  });
});

describe("annualBazi", () => {
  const today = new Date(2026, 9, 23); // ปีม้าไฟ

  it("marks ปีชง for someone born in the year of the rat", () => {
    const a = annualBazi(calculateBazi({ year: 1984, month: 6, day: 1 }), today);
    expect(a.clashYear).toBe(true);
    expect(annualStory(a).body).toContain("ปีชง");
  });

  it("marks the same zodiac year as the birth year", () => {
    expect(annualBazi(calculateBazi({ year: 1990, month: 6, day: 1 }), today).sameAsBirthYear).toBe(true);
  });

  it("has symmetric clash and combine tables and texts for every ten god", () => {
    for (const [a, b] of Object.entries(CLASH)) expect(CLASH[b]).toBe(a);
    for (const [a, b] of Object.entries(COMBINE)) expect(COMBINE[b]).toBe(a);
    for (const g of Object.keys(TEN_GODS)) expect(YEAR_TEN_GOD[g]).toBeDefined();
  });

  it("adds a plain-language section and AI context", () => {
    const r = calculateBazi({ year: 1990, month: 8, day: 15, time: "19:30", gender: "male" }, today);
    const readings = interpretBazi(r, today);
    const year = readings.find((x) => x.heading === "ดวงปีนี้")!;
    expect(year.body).toContain("ปี 2569 ปีมะเมีย ธาตุไฟ");
    expect(year.body + year.advice).not.toMatch(/[一-鿿]|เทพ|ดาว|เสา/);
    const ctx = baziContext(r, today);
    expect(ctx).toContain("ดวงปีนี้");
    expect(ctx).toContain("ดวงปีหน้า (流年, เปลี่ยนปีที่ลี่ชุน): ปี 2570 ปีมะแม");
    expect(ctx).toContain("ดวงอีก 2 ปีข้างหน้า (流年, เปลี่ยนปีที่ลี่ชุน): ปี 2571 ปีวอก");
    expect(ctx).toContain("ช่วงชีวิต 10 ปีทั้งหมด");
    expect(ctx).not.toMatch(/undefined|NaN/);
    expect(ctx.length).toBeLessThan(LIMITS.contextChars);
  });
});

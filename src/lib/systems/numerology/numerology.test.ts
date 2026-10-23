import { describe, expect, it } from "vitest";
import { coreNumbers, nameNumbers, personalMonth, personalYear, reduce } from "./calc";
import { NUMBER_LORE, PERSONAL_YEAR } from "./lore";
import { calculateNumerology, interpretNumerology } from "./story";

describe("reduce", () => {
  it("adds digits and keeps master numbers", () => {
    expect(reduce(1990)).toBe(1);
    expect(reduce(29)).toBe(11);
    expect(reduce(11)).toBe(11);
    expect(reduce(11, false)).toBe(2);
    expect(reduce(44)).toBe(8);
  });
});

describe("coreNumbers", () => {
  it("computes the life path by reducing month, day and year separately", () => {
    // 15/8/1990: 8 + 6 + 1 = 15 → 6
    expect(coreNumbers(1990, 8, 15)).toMatchObject({ lifePath: 6, lifePathCompound: 15, birthday: 6 });
    // 29/11/1980: 11 + 11 + 9 = 31 → 4 (เลขมาสเตอร์ระหว่างทางไม่ทำให้ผลเป็นมาสเตอร์)
    expect(coreNumbers(1980, 11, 29)).toMatchObject({ lifePath: 4, birthday: 11 });
    // 9/2/1999: 2 + 9 + 1 = 12 → 3
    expect(coreNumbers(1999, 2, 9).lifePath).toBe(3);
  });

  it("finds master life paths and karmic debt", () => {
    // 29/2/1980: 2 + 11 + 9 = 22
    expect(coreNumbers(1980, 2, 29).lifePath).toBe(22);
    expect(coreNumbers(1990, 1, 14).karmicDebt).toContain(14);
    expect(coreNumbers(1990, 1, 15).karmicDebt).toEqual([]);
  });

  it("always lands on a number with lore", () => {
    for (let y = 1930; y <= 2025; y += 7) {
      for (let m = 1; m <= 12; m++) {
        for (const d of [1, 9, 11, 19, 22, 28]) {
          const c = coreNumbers(y, m, d);
          expect(NUMBER_LORE[c.lifePath], `${y}-${m}-${d}`).toBeDefined();
          expect(NUMBER_LORE[c.birthday]).toBeDefined();
        }
      }
    }
  });
});

describe("personal year", () => {
  it("cycles 1–9 year by year", () => {
    const years = Array.from({ length: 9 }, (_, i) => personalYear(8, 15, 2020 + i));
    expect(new Set(years).size).toBe(9);
    // 15 ส.ค. ในปี 2026: 8 + 6 + 1 = 15 → 6
    expect(personalYear(8, 15, 2026)).toBe(6);
    expect(personalMonth(6, 10)).toBe(7);
    for (const y of years) expect(PERSONAL_YEAR[y]).toBeDefined();
  });
});

describe("nameNumbers", () => {
  it("uses the Pythagorean table and ignores non-letters", () => {
    // A=1 B=2 … I=9 J=1 … S=1 … Z=8
    const n = nameNumbers("Ab Z")!;
    expect(n.letters).toBe("ABZ");
    expect(n.soulUrge).toBe(1);
    expect(n.personality).toBe(1); // B=2 + Z=8 = 10 → 1
    expect(n.expression).toBe(11); // 1 + 2 + 8 = 11 เป็นเลขมาสเตอร์ จึงไม่ลดต่อ
  });

  it("returns null for names without Latin letters", () => {
    expect(nameNumbers("สมชาย")).toBeNull();
  });
});

describe("interpretNumerology", () => {
  it("covers the main numbers, the name and this year", () => {
    const r = calculateNumerology({ year: 1990, month: 8, day: 15, name: "Somchai Jaidee" });
    const headings = interpretNumerology(r, new Date(2026, 9, 23)).map((x) => x.heading);
    expect(headings[0]).toMatch(/^เลขเส้นทางชีวิต 6/);
    expect(headings.some((h) => h.startsWith("เลขจากชื่อ"))).toBe(true);
    expect(headings.some((h) => h.startsWith("ปีส่วนตัว 6 (ปี 2569)"))).toBe(true);
  });
});

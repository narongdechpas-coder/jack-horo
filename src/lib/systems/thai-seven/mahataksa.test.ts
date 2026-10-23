import { describe, expect, it } from "vitest";
import { ROLES, roleOf, type Planet } from "../daily/taksa";
import { calculateSeven } from "./calculate";
import { PLANET_LORE, YEAR_ROLE_TEXT } from "./lore";
import { TAKSA_YEARS, fullAge, mahaTaksa, sevenTaksa } from "./mahataksa";
import { HOUSES } from "./meanings";
import { interpretSeven } from "./story";

const born = new Date(1990, 0, 7); // อาทิตย์
const at = (age: number) => new Date(1990 + age, 5, 1);

describe("mahaTaksa", () => {
  it("adds up to 108 years", () => {
    expect(Object.values(TAKSA_YEARS).reduce((a, b) => a + b, 0)).toBe(108);
    const t = mahaTaksa(1, born, at(10));
    expect(t.periods.at(-1)!.endAge).toBe(108);
  });

  it("follows the ทักษา order from the birth day", () => {
    const t = mahaTaksa(1, born, at(0));
    expect(t.periods.map((p) => [p.name, p.startAge, p.endAge])).toEqual([
      ["อาทิตย์", 0, 6], ["จันทร์", 6, 21], ["อังคาร", 21, 29], ["พุธ", 29, 46],
      ["เสาร์", 46, 56], ["พฤหัสบดี", 56, 75], ["ราหู", 75, 87], ["ศุกร์", 87, 108],
    ]);
  });

  it("finds the current and next period", () => {
    const t = mahaTaksa(1, born, at(30));
    expect(t.age).toBe(30);
    expect(t.current.name).toBe("พุธ");
    expect(t.yearsLeft).toBe(16);
    expect(t.next.name).toBe("เสาร์");
    expect(t.current.startYear).toBe(1990 + 29 + 543);
    expect(t.role).toBe(roleOf(1, 4));
  });

  it("starts Wednesday-night births at ราหู", () => {
    expect(mahaTaksa(8, born, at(3)).current.name).toBe("ราหู");
  });

  it("wraps into a new cycle after 108 years", () => {
    const t = mahaTaksa(1, born, at(110));
    expect(t.current).toMatchObject({ name: "อาทิตย์", startAge: 108, endAge: 114 });
  });

  it("counts full years by birthday", () => {
    expect(fullAge(new Date(2000, 5, 15), new Date(2026, 5, 14))).toBe(25);
    expect(fullAge(new Date(2000, 5, 15), new Date(2026, 5, 15))).toBe(26);
  });

  it("uses the astrological day of a seven-number chart", () => {
    // 1990-08-15 เป็นวันพุธ เกิด 19:30 จึงเป็นพุธกลางคืน
    const chart = calculateSeven({ year: 1990, month: 8, day: 15, time: "19:30" });
    expect(sevenTaksa(chart, new Date(2000, 0, 1)).current.name).toBe("ราหู");
  });
});

describe("thai-seven lore", () => {
  it("covers every planet and role", () => {
    for (const p of [1, 2, 3, 4, 5, 6, 7, 8] as Planet[]) for (const v of Object.values(PLANET_LORE[p])) expect(v.length).toBeGreaterThan(3);
    for (const r of ROLES) expect(YEAR_ROLE_TEXT[r].story.length).toBeGreaterThan(10);
  });

  it("adds a jargon-free life-period section when today is known", () => {
    const chart = calculateSeven({ year: 1990, month: 8, day: 15 });
    const readings = interpretSeven(chart, new Date(2026, 9, 23));
    const life = readings.at(-1)!;
    expect(life.heading).toBe("ช่วงชีวิตตอนนี้");
    expect(life.body).toContain("พ.ศ.");
    for (const word of [...HOUSES.flat().map((h) => h.name), "ภพ", "ดาว"]) expect(life.body + life.advice).not.toContain(word);
  });
});

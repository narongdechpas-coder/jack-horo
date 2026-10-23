import { describe, expect, it } from "vitest";
import { readTarot } from "@/lib/systems/tarot/spreads";
import { BIRTH_DAYS, PLANET_NAMES, ROLES, dailySeed, dailyTaksa, planetAt, roleOf, thaiDate, type Planet } from "./taksa";

const name = (p: Planet) => PLANET_NAMES[p];

describe("taksa wheel", () => {
  it("matches the well-known table for someone born on Sunday", () => {
    expect(ROLES.map((r) => name(planetAt(1, r)))).toEqual([
      "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "เสาร์", "พฤหัสบดี", "ราหู", "ศุกร์",
    ]);
  });

  // ดาวกาลกิณีของแต่ละวันเกิด ตามตารางสีกาลกิณีที่ใช้กันทั่วไป
  it.each<[Planet, string]>([
    [1, "ศุกร์"], [2, "อาทิตย์"], [3, "จันทร์"], [4, "อังคาร"], [8, "พฤหัสบดี"], [5, "เสาร์"], [6, "ราหู"], [7, "พุธ"],
  ])("born %i: กาลกิณี is %s", (birth, planet) => {
    expect(name(planetAt(birth, "กาลกิณี"))).toBe(planet);
  });

  it.each<[Planet, string]>([
    [1, "พุธ"], [2, "เสาร์"], [3, "พฤหัสบดี"], [4, "ราหู"], [7, "ศุกร์"],
  ])("born %i: ศรี is %s", (birth, planet) => {
    expect(name(planetAt(birth, "ศรี"))).toBe(planet);
  });

  it("roleOf and planetAt are inverses for every pair", () => {
    for (const { planet: b } of BIRTH_DAYS) for (const r of ROLES) expect(roleOf(b, planetAt(b, r))).toBe(r);
  });

  it("gives each birth day a different role every weekday", () => {
    for (const { planet: b } of BIRTH_DAYS) {
      const roles = [1, 2, 3, 4, 5, 6, 7].map((t) => roleOf(b, t as Planet));
      expect(new Set(roles).size).toBe(7);
    }
  });
});

describe("dailyTaksa", () => {
  // 25 ต.ค. 2026 เป็นวันอาทิตย์ → คนเกิดวันอาทิตย์ได้ภูมิบริวาร คนเกิดวันศุกร์ได้ภูมิอายุ
  const sunday = new Date(2026, 9, 25, 9, 0);

  it("reads today's planet in the user's wheel", () => {
    expect(dailyTaksa(1, sunday)).toMatchObject({ today: 1, role: "บริวาร", luckyColor: "เขียว", avoidColor: "ฟ้า น้ำเงิน" });
    expect(dailyTaksa(6, sunday).role).toBe("อายุ");
    expect(dailyTaksa(2, sunday)).toMatchObject({ role: "กาลกิณี", tone: "caution", toneLabel: "วันควรระวัง" });
  });

  it("has a story and advice for every role", () => {
    for (const { planet } of BIRTH_DAYS) {
      for (let d = 0; d < 7; d++) {
        const r = dailyTaksa(planet, new Date(2026, 9, 25 + d));
        expect(r.story.length).toBeGreaterThan(40);
        expect(r.advice.length).toBeGreaterThan(20);
      }
    }
  });
});

describe("thaiDate", () => {
  it("formats in Thai with the Buddhist year", () => {
    expect(thaiDate(new Date(2026, 9, 23))).toBe("วันศุกร์ที่ 23 ตุลาคม 2569");
  });
});

describe("daily tarot card", () => {
  it("is the same card all day and changes the next day", () => {
    const morning = readTarot("daily", dailySeed(new Date(2026, 9, 23, 0, 5))).cards[0];
    const night = readTarot("daily", dailySeed(new Date(2026, 9, 23, 23, 55))).cards[0];
    expect(night).toEqual(morning);
    const days = Array.from({ length: 14 }, (_, i) => readTarot("daily", dailySeed(new Date(2026, 9, 23 + i))).cards[0].card.id);
    expect(new Set(days).size).toBeGreaterThan(10);
  });
});

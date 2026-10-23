import * as Astronomy from "astronomy-engine";
import { describe, expect, it } from "vitest";
import { ascendantAt, calculateZodiac, dailyZodiac, longitudeOf, placement, solarHouse, yearlyZodiac } from "./chart";
import { MOON_TRANSIT, SIGNS } from "./lore";
import { PROVINCES } from "./provinces";

const angleDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

describe("calculateZodiac", () => {
  it("puts the Sun in the expected sign across the year", () => {
    const cases: [number, number, number][] = [
      [3, 25, 0], [5, 1, 1], [6, 5, 2], [7, 4, 3], [8, 15, 4], [9, 5, 5],
      [10, 5, 6], [11, 5, 7], [12, 5, 8], [1, 5, 9], [2, 5, 10], [3, 5, 11],
    ];
    for (const [month, day, sign] of cases) {
      expect(calculateZodiac({ year: 1995, month, day }).planets.sun.sign, `${month}/${day}`).toBe(sign);
    }
  });

  it("matches a known position: 15 Aug 1990 Sun at Leo 22°", () => {
    const sun = calculateZodiac({ year: 1990, month: 8, day: 15, time: "19:30" }).planets.sun;
    expect(sun.sign).toBe(4);
    expect(sun.degree).toBeGreaterThan(21.5);
    expect(sun.degree).toBeLessThan(23);
  });

  it("puts the ascendant on the Sun at sunrise and opposite at sunset (Bangkok)", () => {
    const bkk = PROVINCES[0];
    const observer = new Astronomy.Observer(bkk.lat, bkk.lon, 0);
    for (const start of [new Date(Date.UTC(2024, 0, 10)), new Date(Date.UTC(2024, 5, 10)), new Date(Date.UTC(2024, 8, 22))]) {
      const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, start, 2)!.date;
      const set = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, start, 2)!.date;
      expect(angleDiff(ascendantAt(rise, bkk.lat, bkk.lon), longitudeOf("sun", rise))).toBeLessThan(1.5);
      expect(angleDiff(ascendantAt(set, bkk.lat, bkk.lon), longitudeOf("sun", set) + 180)).toBeLessThan(1.5);
    }
  });

  it("has no ascendant without a birth time and flags a moon sign change", () => {
    const chart = calculateZodiac({ year: 1990, month: 8, day: 15 });
    expect(chart.ascendant).toBeNull();
    // ดวงจันทร์ย้ายราศีทุก ~2.5 วัน: ภายใน 3 วันติดกันต้องมีอย่างน้อยหนึ่งวันที่ไม่แน่ชัด
    const flags = [15, 16, 17].map((day) => calculateZodiac({ year: 1990, month: 8, day }).moonUncertain);
    expect(flags).toContain(true);
  });

  it("uses the birth province for the ascendant", () => {
    const a = calculateZodiac({ year: 1990, month: 8, day: 15, time: "07:00", province: "แม่ฮ่องสอน" }).ascendant!;
    const b = calculateZodiac({ year: 1990, month: 8, day: 15, time: "07:00", province: "อุบลราชธานี" }).ascendant!;
    expect(angleDiff(a.longitude, b.longitude)).toBeGreaterThan(4);
  });

  it("rejects invalid dates", () => {
    expect(() => calculateZodiac({ year: 1990, month: 2, day: 30 })).toThrow();
    expect(() => calculateZodiac({ year: 1900, month: 1, day: 1 })).toThrow();
  });
});

describe("transits", () => {
  it("counts solar houses from the sun sign", () => {
    expect(solarHouse(0, 0)).toBe(0);
    expect(solarHouse(10, 1)).toBe(3);
  });

  it("reads the daily moon and the yearly Jupiter/Saturn", () => {
    const d = dailyZodiac(4, new Date(2026, 9, 23));
    expect(d.story).toBe(MOON_TRANSIT[d.house].story);
    const y = yearlyZodiac(4, new Date(2026, 9, 23));
    expect(y.jupiterSign).toBe(placement(longitudeOf("jupiter", new Date(Date.UTC(2026, 9, 23, 5)))).sign);
    expect(y.jupiter.length).toBeGreaterThan(10);
  });
});

describe("zodiac data", () => {
  it("has 12 signs and 77 provinces", () => {
    expect(SIGNS).toHaveLength(12);
    expect(PROVINCES).toHaveLength(77);
    expect(new Set(PROVINCES.map((p) => p.name)).size).toBe(77);
    for (const p of PROVINCES) {
      expect(p.lat).toBeGreaterThan(5.5);
      expect(p.lat).toBeLessThan(20.5);
      expect(p.lon).toBeGreaterThan(97.3);
      expect(p.lon).toBeLessThan(105.7);
    }
  });
});

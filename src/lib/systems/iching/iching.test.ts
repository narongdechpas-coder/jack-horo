import { describe, expect, it } from "vitest";
import { HEXAGRAMS, coinsToLine, hexagramOf, parseLines, readIChing, type LineValue } from "./cast";
import { HEXAGRAM_LORE } from "./lore";
import { TRIGRAMS } from "./trigrams";
import { interpretIChing } from "./story";

const byNumber = (n: number) => HEXAGRAMS.find((h) => h.number === n)!;

describe("hexagram data", () => {
  it("has all 64 hexagrams with every trigram pair exactly once", () => {
    expect(HEXAGRAMS).toHaveLength(64);
    expect(new Set(HEXAGRAMS.map((h) => h.number)).size).toBe(64);
    expect(new Set(HEXAGRAMS.map((h) => `${h.upper.zh}${h.lower.zh}`)).size).toBe(64);
    for (const h of HEXAGRAMS) {
      expect(h.upper, `${h.number}`).toBeDefined();
      expect(h.lower, `${h.number}`).toBeDefined();
    }
  });

  it("matches well-known hexagrams", () => {
    expect(byNumber(1)).toMatchObject({ zh: "乾", lines: [1, 1, 1, 1, 1, 1] });
    expect(byNumber(2)).toMatchObject({ zh: "坤", lines: [0, 0, 0, 0, 0, 0] });
    expect(byNumber(11)).toMatchObject({ zh: "泰", upper: { th: "ดิน" }, lower: { th: "ฟ้า" } });
    expect(byNumber(12)).toMatchObject({ zh: "否", upper: { th: "ฟ้า" }, lower: { th: "ดิน" } });
    expect(byNumber(63)).toMatchObject({ upper: { th: "น้ำ" }, lower: { th: "ไฟ" }, lines: [1, 0, 1, 0, 1, 0] });
    expect(byNumber(64).lines).toEqual([0, 1, 0, 1, 0, 1]);
    expect(byNumber(3).lines).toEqual([1, 0, 0, 0, 1, 0]);
  });

  it("finds the same hexagram from its lines", () => {
    for (const h of HEXAGRAMS) expect(hexagramOf(h.lines).number).toBe(h.number);
  });

  it("has 8 distinct trigrams and Thai lore for every hexagram", () => {
    expect(new Set(TRIGRAMS.map((t) => t.lines.join(""))).size).toBe(8);
    expect(HEXAGRAM_LORE).toHaveLength(64);
    for (const l of HEXAGRAM_LORE) for (const v of Object.values(l)) expect(v.length).toBeGreaterThan(3);
  });
});

describe("casting", () => {
  it("gives the classic three-coin odds: 6 and 9 = 1/8, 7 and 8 = 3/8", () => {
    const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let m = 0; m < 8; m++) counts[coinsToLine([!!(m & 1), !!(m & 2), !!(m & 4)])]++;
    expect(counts).toEqual({ 6: 1, 7: 3, 8: 3, 9: 1 });
  });

  it("reads stable and changing lines", () => {
    const still = readIChing([7, 7, 7, 7, 7, 7]);
    expect(still.primary.number).toBe(1);
    expect(still.changing).toEqual([]);
    expect(still.result).toBeNull();

    const all = readIChing([9, 9, 9, 9, 9, 9]);
    expect(all.primary.number).toBe(1);
    expect(all.changing).toEqual([1, 2, 3, 4, 5, 6]);
    expect(all.result!.number).toBe(2);

    // 泰 (11) เปลี่ยนเส้นล่างสุด → ฉากที่เส้นล่างเป็นหยิน
    const r = readIChing([9, 7, 7, 8, 8, 8]);
    expect(r.primary.number).toBe(11);
    expect(r.changing).toEqual([1]);
    expect(r.result!.lines).toEqual([0, 1, 1, 0, 0, 0]);
  });

  it("parses shared links strictly", () => {
    expect(parseLines("789868")).toEqual([7, 8, 9, 8, 6, 8]);
    for (const bad of [null, "", "78986", "7898680", "789865", "abcdef"]) expect(parseLines(bad)).toBeNull();
  });
});

describe("interpretIChing", () => {
  it("explains the changing lines and the resulting hexagram", () => {
    const readings = interpretIChing(readIChing([9, 7, 7, 8, 8, 8] as LineValue[], "งานใหม่"));
    const text = readings.map((r) => r.heading + r.body).join(" ");
    expect(text).toContain("สันติและความรุ่งเรือง");
    expect(text).toContain("เส้นที่ 1");
    expect(readings.map((r) => r.heading)).toContain("ทิศทางที่เรื่องกำลังไป");
  });
});

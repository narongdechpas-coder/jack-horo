import { describe, expect, it } from "vitest";
import { QUESTIONS, SYMBOLS, TONES } from "./data";
import { oracleIndex, parseOracleParams, readOracle } from "./oracle";

describe("data", () => {
  it("has 32 questions and 32 symbols, one per 5-line figure", () => {
    expect(QUESTIONS).toHaveLength(32);
    expect(SYMBOLS).toHaveLength(32);
    expect(new Set(SYMBOLS.map((s) => s.name)).size).toBe(32);
    for (const s of SYMBOLS) {
      expect(TONES[s.tone], s.name).toBeDefined();
      expect(s.verse.length).toBeGreaterThan(50);
    }
  });
});

describe("oracleIndex", () => {
  it("reads odd as 1 and even as 0, first line most significant", () => {
    expect(oracleIndex([2, 2, 2, 2, 2])).toBe(0);
    expect(oracleIndex([1, 1, 1, 1, 1])).toBe(31);
    expect(oracleIndex([3, 4, 4, 4, 4])).toBe(16);
    expect(oracleIndex([4, 4, 4, 4, 7])).toBe(1);
  });

  it("matches the original page's symbols", () => {
    expect(readOracle(0, [2, 2, 2, 2, 2]).symbol.name).toBe("ดาวรุ่ง");
    expect(readOracle(0, [1, 1, 1, 1, 1]).symbol.name).toBe("วงแหวนทอง");
  });

  it("reaches every symbol", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 32; i++) seen.add(oracleIndex([...i.toString(2).padStart(5, "0")].map((b) => (b === "1" ? 3 : 2))));
    expect(seen.size).toBe(32);
  });
});

describe("parseOracleParams", () => {
  it("accepts a valid link", () => {
    expect(parseOracleParams("4", "5,2,7,4,9")).toEqual({ questionIndex: 4, counts: [5, 2, 7, 4, 9] });
  });

  it.each<[string | null, string | null]>([
    [null, "1,2,3,4,5"],
    ["4", null],
    ["32", "1,2,3,4,5"],
    ["4", "1,2,3,4"],
    ["4", "0,2,3,4,5"],
    ["4", "1,x,3,4,5"],
  ])("rejects q=%s c=%s", (q, c) => {
    expect(parseOracleParams(q, c)).toBeNull();
  });
});

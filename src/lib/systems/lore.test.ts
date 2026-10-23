import { describe, expect, it } from "vitest";
import { detectTopic } from "./reading-kb";
import { DECK } from "./playing-cards/deck";
import { findCardCombos } from "./playing-cards/combos";
import { CARD_LORE } from "./playing-cards/lore";
import { TAROT_DECK } from "./tarot/deck";
import { findTarotCombos } from "./tarot/combos";
import { TAROT_LORE } from "./tarot/lore";
import { getTarotSpread, type DrawnTarot } from "./tarot/spreads";

const tarot = (id: string) => TAROT_DECK.find((c) => c.id === id)!;
const draw = (spreadId: string, ids: string[], reversed: boolean[] = []): DrawnTarot[] => {
  const spread = getTarotSpread(spreadId);
  return ids.map((id, i) => ({ card: tarot(id), reversed: reversed[i] ?? false, position: spread.positions[i] }));
};
const card = (label: string) => DECK.find((c) => `${c.rank}${c.suit[0]}` === label)!;
const titles = (combos: { title: string }[]) => combos.map((c) => c.title);

describe("knowledge base coverage", () => {
  it("has full lore for all 78 tarot cards", () => {
    expect(Object.keys(TAROT_LORE)).toHaveLength(78);
    for (const c of TAROT_DECK) {
      const lore = TAROT_LORE[c.id];
      expect(lore, c.id).toBeDefined();
      for (const v of Object.values(lore)) expect(v.length, c.id).toBeGreaterThan(10);
    }
  });

  it("has full lore for all 52 playing cards", () => {
    expect(CARD_LORE).toHaveLength(52);
    for (const l of CARD_LORE) for (const v of Object.values(l)) expect(v.length).toBeGreaterThan(5);
  });

  it("matches lore to the right card", () => {
    expect(TAROT_LORE["major-16"].scene).toContain("หอคอย");
    expect(TAROT_LORE["cups-02"].love).toContain("ใจตรงกัน");
    expect(TAROT_LORE["pentacles-14"].scene).toContain("ราชา");
  });
});

describe("findTarotCombos", () => {
  it("reads a suit majority and a Book T triplet", () => {
    const combos = findTarotCombos(getTarotSpread("three"), draw("three", ["cups-03", "wands-03", "swords-03"]));
    expect(titles(combos)).toContain("เลข 3 3 ใบ");
    expect(combos.find((c) => c.title === "เลข 3 3 ใบ")).toMatchObject({ text: "ระวังการหลอกลวง", source: "book-t" });
  });

  it("reads major arcana majority and named pairs in any order", () => {
    const combos = findTarotCombos(getTarotSpread("three"), draw("three", ["major-17", "pentacles-03", "major-16"]));
    expect(titles(combos)).toEqual(expect.arrayContaining(["ไพ่ใบใหญ่ (Major Arcana) ออก 2 จาก 3 ใบ", "หอคอย + ดวงดาว"]));
  });

  it("applies elemental dignities to neighbours only", () => {
    const strong = findTarotCombos(getTarotSpread("three"), draw("three", ["cups-04", "cups-07", "major-00"]));
    expect(titles(strong)).toContain("ธาตุเดียวกันเสริมกำลัง");
    const weak = findTarotCombos(getTarotSpread("three"), draw("three", ["wands-02", "cups-05", "major-00"]));
    expect(titles(weak)).toContain("ธาตุตรงข้ามทอนกำลัง");
    // first and last are not neighbours
    const apart = findTarotCombos(getTarotSpread("three"), draw("three", ["wands-02", "major-00", "cups-05"]));
    expect(titles(apart)).not.toContain("ธาตุตรงข้ามทอนกำลัง");
  });

  it("reads the past-to-future direction", () => {
    const combos = findTarotCombos(getTarotSpread("three"), draw("three", ["major-00", "major-01", "major-02"], [true, false, false]));
    expect(titles(combos)).toContain("จากติดขัดสู่คลี่คลาย");
  });

  it("returns nothing for a single card", () => {
    expect(findTarotCombos(getTarotSpread("daily"), draw("daily", ["major-19"]))).toEqual([]);
  });
});

describe("findCardCombos", () => {
  it("reads colour, same rank and suit pairs", () => {
    const combos = findCardCombos([card("7h"), card("7d"), card("Kh")]);
    expect(titles(combos)).toEqual(expect.arrayContaining(["ไพ่แดงทุกใบ", "7 ออก 2 ใบ", "หัวใจ + ข้าวหลามตัด"]));
  });

  it("spots a couple (Q and K of the same suit)", () => {
    expect(titles(findCardCombos([card("Qs"), card("2c"), card("Ks")]))).toContain("Q กับ K โพดำ");
  });
});

describe("detectTopic", () => {
  it("guesses the topic from the question", () => {
    expect(detectTopic("แฟนจะกลับมาคืนดีไหม")).toBe("love");
    expect(detectTopic("งานใหม่จะได้เงินเดือนเพิ่มไหม")).toBe("work");
    expect(detectTopic("")).toBe("general");
  });
});

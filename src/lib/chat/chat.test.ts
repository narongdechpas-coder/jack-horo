import { describe, expect, it, vi } from "vitest";
import Anthropic from "@anthropic-ai/sdk";
import { calculateBazi } from "@/lib/systems/bazi/calculate";
import { readOracle } from "@/lib/systems/oraculum/oracle";
import { readSpread } from "@/lib/systems/playing-cards/spreads";
import { TAROT_SPREADS, readTarot } from "@/lib/systems/tarot/spreads";
import { calculateSeven } from "@/lib/systems/thai-seven/calculate";
import { baziContext, ichingContext, numerologyContext, oracleContext, playingCardsContext, sevenContext, tarotContext, zodiacContext } from "./context";
import { calculateZodiac } from "@/lib/systems/zodiac/chart";
import { readIChing } from "@/lib/systems/iching/cast";
import { calculateNumerology } from "@/lib/systems/numerology/story";
import { REFUSAL_TEXT, buildParams, createChatHandler } from "./handler";
import { LIMITS, MODEL } from "./prompt";
import { parseChatRequest } from "./request";

describe("reading contexts", () => {
  const cases: [string, string, string[]][] = [];
  for (const s of TAROT_SPREADS) {
    const r = readTarot(s.id, 11, null);
    cases.push([`tarot ${s.id}`, tarotContext(r, "งานใหม่"), r.cards.map((c) => c.card.nameTh)]);
  }
  const pc = readSpread("three", 12345);
  cases.push(["playing cards", playingCardsContext(pc, ""), pc.cards.map((c) => c.card.meaning)]);
  const or = readOracle(8, [3, 2, 1, 4, 5]);
  cases.push(["oraculum", oracleContext(or), ["ดวงตาที่สาม", or.question]]);
  cases.push(["thai seven", sevenContext(calculateSeven({ year: 1990, month: 8, day: 15, time: "19:30" })), ["การงาน", "ความรัก"]]);
  cases.push(["bazi", baziContext(calculateBazi({ year: 1990, month: 8, day: 15, time: "19:30", gender: "male" }, new Date(2026, 0, 1))), ["ธาตุประจำตัว", "2018–2027"]]);

  it.each(cases)("%s includes the reading and stays within limits", (_name, text, mustContain) => {
    for (const m of mustContain) expect(text).toContain(m);
    expect(text).not.toMatch(/undefined|null|NaN|\[object/);
    expect(text.length).toBeLessThan(LIMITS.contextChars);
  });

  it("feeds the knowledge base and card combinations to the AI", () => {
    const text = tarotContext(readTarot("three", 11, null), "แฟนจะกลับมาไหม");
    expect(text).toContain("หัวข้อที่น่าจะถาม (เดาจากคำถาม): ความรัก");
    expect(text).toContain("ตำรา Waite 1910:");
    expect(text).toContain("ไพ่ที่อ่านร่วมกัน");
    expect(playingCardsContext(readSpread("three", 5), "")).toContain("คำแนะนำ:");
  });

  it("gives the AI the full seven-number chart and the current life period", () => {
    const text = sevenContext(calculateSeven({ year: 1990, month: 8, day: 15, time: "19:30" }), new Date(2026, 9, 23));
    expect(text).toContain("แถว 1: อัตตะ=");
    expect(text).toContain("มหาทักษา");
    expect(text).toContain("อายุ 36 ปี");
    expect(text).not.toMatch(/undefined|NaN/);
    expect(text.length).toBeLessThan(LIMITS.contextChars);
  });

  it("gives the AI the zodiac chart, today and the yearly transits", () => {
    const text = zodiacContext(calculateZodiac({ year: 1990, month: 8, day: 15, time: "19:30", province: "เชียงใหม่" }), new Date(2026, 9, 23));
    for (const m of ["ดวงอาทิตย์ (", "ราศีสิงห์", "ลัคนา (", "ดวงวันนี้", "ดวงช่วงปีนี้", "ดวงปีหน้า", "Tropical"]) expect(text).toContain(m);
    expect(text).not.toMatch(/undefined|NaN/);
    expect(text.length).toBeLessThan(LIMITS.contextChars);
  });

  it("gives the AI both I Ching hexagrams and the changing lines", () => {
    const text = ichingContext(readIChing([9, 7, 7, 8, 8, 6], "ควรย้ายงานไหม"));
    for (const m of ["ควรย้ายงานไหม", "ฉากหลัก", "泰", "เส้นที่ 1", "เส้นที่ 6", "ฉากผลลัพธ์", "หลักการอ่าน"]) expect(text).toContain(m);
    expect(text).not.toMatch(/undefined|NaN/);
    expect(text.length).toBeLessThan(LIMITS.contextChars);
  });

  it("gives the AI the numerology numbers and three personal years", () => {
    const text = numerologyContext(calculateNumerology({ year: 1990, month: 8, day: 15, name: "Somchai Jaidee" }), new Date(2026, 9, 23));
    for (const m of ["เลขเส้นทางชีวิต: 6", "เลขชะตา (Expression)", "ปีส่วนตัวปีนี้ (พ.ศ. 2569): 6", "ปีส่วนตัวปีหน้า", "หลักการอ่าน"]) expect(text).toContain(m);
    expect(text).not.toMatch(/undefined|NaN/);
    expect(text.length).toBeLessThan(LIMITS.contextChars);
  });

  it("keeps the longest Celtic Cross with a long question within the limit", () => {
    let longest = 0;
    for (let seed = 0; seed < 300; seed++) {
      longest = Math.max(longest, tarotContext(readTarot("celtic", seed, null), "ก".repeat(200)).length);
    }
    expect(longest).toBeLessThan(LIMITS.contextChars);
  });
});

describe("parseChatRequest", () => {
  const ok = { system: "ไพ่ยิปซี", context: "ผลดวง", messages: [{ role: "user", content: "สรุปให้หน่อย" }] };

  it("accepts a valid conversation", () => {
    expect(parseChatRequest(ok)).toEqual(ok);
    const multi = { ...ok, messages: [...ok.messages, { role: "assistant", content: "..." }, { role: "user", content: "แล้วไง" }] };
    expect("error" in parseChatRequest(multi)).toBe(false);
  });

  it.each<[string, unknown]>([
    ["not an object", "x"],
    ["no context", { ...ok, context: "" }],
    ["context too long", { ...ok, context: "x".repeat(LIMITS.contextChars + 1) }],
    ["no messages", { ...ok, messages: [] }],
    ["starts with assistant", { ...ok, messages: [{ role: "assistant", content: "hi" }] }],
    ["ends with assistant", { ...ok, messages: [...ok.messages, { role: "assistant", content: "hi" }] }],
    ["bad role", { ...ok, messages: [{ role: "system", content: "hi" }] }],
    ["question too long", { ...ok, messages: [{ role: "user", content: "x".repeat(LIMITS.messageChars + 1) }] }],
    ["too many messages", { ...ok, messages: Array.from({ length: LIMITS.messages + 1 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "x" })) }],
  ])("rejects %s", (_name, body) => {
    expect("error" in parseChatRequest(body)).toBe(true);
  });
});

describe("buildParams", () => {
  it("uses Sonnet 5.5 at low effort with caching and default fallbacks", () => {
    const p = buildParams({ system: "ไพ่ยิปซี", context: "ผลดวง", messages: [{ role: "user", content: "q" }] });
    expect(p.model).toBe(MODEL);
    expect(MODEL).toBe("claude-sonnet-5-5");
    expect(p.output_config).toEqual({ effort: "low" });
    expect(p.cache_control).toEqual({ type: "ephemeral" });
    expect(p.fallbacks).toBe("default");
    expect(p.betas).toEqual(["server-side-fallback-2026-07-01"]);
    expect(JSON.stringify(p.system)).toContain("<reading>\\nผลดวง\\n</reading>");
  });
});

/** client ปลอมที่ stream ข้อความกลับโดยไม่เรียก API จริง */
function fakeClient(chunks: string[], stopReason = "end_turn", error?: Error) {
  const stream = vi.fn(() => ({
    async *[Symbol.asyncIterator]() {
      for (const t of chunks) yield { type: "content_block_delta", delta: { type: "text_delta", text: t } };
      if (error) throw error;
    },
    finalMessage: async () => ({ stop_reason: stopReason }),
  }));
  return { client: { beta: { messages: { stream } } } as unknown as Anthropic, stream };
}

const post = (body: unknown) => new Request("https://x/", { method: "POST", body: JSON.stringify(body) });
const valid = { system: "ไพ่ยิปซี", context: "ผลดวง", messages: [{ role: "user", content: "สรุปให้หน่อย" }] };

describe("createChatHandler", () => {
  it("streams the answer text", async () => {
    const { client, stream } = fakeClient(["ไพ่ของคุณ", "บอกว่า..."]);
    const res = await createChatHandler(() => client)(post(valid));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("ไพ่ของคุณบอกว่า...");
    expect(stream).toHaveBeenCalledOnce();
  });

  it("adds a polite note when Claude declines", async () => {
    const { client } = fakeClient([], "refusal");
    expect(await (await createChatHandler(() => client)(post(valid))).text()).toBe(REFUSAL_TEXT);
  });

  it("reports API errors in Thai instead of crashing", async () => {
    const { client } = fakeClient(["เริ่ม"], "end_turn", new Error("boom"));
    expect(await (await createChatHandler(() => client)(post(valid))).text()).toContain("⚠️");
  });

  it("returns 400 for invalid input without calling Claude", async () => {
    const { client, stream } = fakeClient([]);
    const res = await createChatHandler(() => client)(post({ ...valid, messages: [] }));
    expect(res.status).toBe(400);
    expect(stream).not.toHaveBeenCalled();
  });

  it("returns 503 when the API key is missing", async () => {
    expect((await createChatHandler(() => null)(post(valid))).status).toBe(503);
  });

  it("rejects non-POST requests", async () => {
    expect((await createChatHandler(() => null)(new Request("https://x/"))).status).toBe(405);
  });
});

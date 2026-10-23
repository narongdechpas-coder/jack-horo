import Anthropic from "@anthropic-ai/sdk";
import type { BetaMessageStreamParams } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { MODEL, SYSTEM_PROMPT } from "./prompt";
import { parseChatRequest, type ChatRequest } from "./request";

export const REFUSAL_TEXT = "\n\n(หมอดูขอไม่ตอบคำถามนี้นะ ลองถามเรื่องอื่นเกี่ยวกับดวงของคุณได้เลย)";

/** พารามิเตอร์ที่ส่งให้ Claude แยกออกมาเพื่อให้ทดสอบได้ */
export function buildParams(req: ChatRequest): BetaMessageStreamParams {
  return {
    model: MODEL,
    max_tokens: 4000,
    // งานแชทสั้น ๆ ใช้ effort ต่ำพอ และตอบเร็วกว่า
    output_config: { effort: "low" },
    // ถ้าโมเดลปฏิเสธ ให้ API ลองโมเดลที่เหมาะกับหมวดนั้นแทนโดยอัตโนมัติ
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    // แคช system prompt + ผลดวง + ประวัติแชท คำถามถัดไปในดวงเดียวกันจะถูกลง
    cache_control: { type: "ephemeral" },
    system: [
      { type: "text", text: SYSTEM_PROMPT },
      { type: "text", text: `ศาสตร์: ${req.system}\n<reading>\n${req.context}\n</reading>` },
    ],
    messages: req.messages,
  };
}

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });

function errorText(err: unknown): string {
  if (err instanceof Anthropic.RateLimitError) return "ตอนนี้มีคนถามหมอดูเยอะมาก รอสักครู่แล้วลองใหม่นะ";
  if (err instanceof Anthropic.AuthenticationError) return "ระบบหมอดูตั้งค่า API key ไม่ถูกต้อง";
  if (err instanceof Anthropic.APIError) return `หมอดูติดขัดชั่วคราว (${err.status ?? "?"}) ลองใหม่อีกครั้งนะ`;
  return "หมอดูติดขัดชั่วคราว ลองใหม่อีกครั้งนะ";
}

/** สร้าง handler ของ endpoint แชท โดยรับ client เข้ามา (ใน test ใส่ client ปลอมได้) */
export function createChatHandler(getClient: () => Anthropic | null) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== "POST") return text("ใช้ได้เฉพาะ POST", 405);
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return text("รูปแบบข้อมูลไม่ถูกต้อง", 400);
    }
    const parsed = parseChatRequest(body);
    if ("error" in parsed) return text(parsed.error, 400);

    const client = getClient();
    if (!client) return text("ยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY บน Netlify", 503);

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          const response = client.beta.messages.stream(buildParams(parsed));
          for await (const event of response) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          const final = await response.finalMessage();
          if (final.stop_reason === "refusal") controller.enqueue(encoder.encode(REFUSAL_TEXT));
        } catch (err) {
          console.error("fortune-chat error", err);
          controller.enqueue(encoder.encode(`\n\n⚠️ ${errorText(err)}`));
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  };
}

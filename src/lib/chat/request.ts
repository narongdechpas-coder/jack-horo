import { LIMITS } from "./prompt";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  /** ชื่อศาสตร์ เช่น "ไพ่ยิปซี" */
  system: string;
  /** ผลดวงที่แปลงเป็นข้อความแล้ว */
  context: string;
  messages: ChatMessage[];
}

/** ตรวจ body ที่ส่งมาจากเบราว์เซอร์ คืน ChatRequest หรือข้อความ error */
export function parseChatRequest(body: unknown): ChatRequest | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "รูปแบบข้อมูลไม่ถูกต้อง" };
  const { system, context, messages } = body as Record<string, unknown>;
  if (typeof system !== "string" || system.length === 0 || system.length > 50) return { error: "ไม่ระบุศาสตร์" };
  if (typeof context !== "string" || context.length === 0) return { error: "ไม่มีผลดวง" };
  if (context.length > LIMITS.contextChars) return { error: "ผลดวงยาวเกินไป" };
  if (!Array.isArray(messages) || messages.length === 0) return { error: "ไม่มีข้อความ" };
  if (messages.length > LIMITS.messages) return { error: "บทสนทนายาวเกินไป กด \"เริ่มใหม่\" เพื่อคุยต่อ" };

  const clean: ChatMessage[] = [];
  for (const [i, m] of messages.entries()) {
    if (typeof m !== "object" || m === null) return { error: "ข้อความไม่ถูกต้อง" };
    const { role, content } = m as Record<string, unknown>;
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (role !== expected) return { error: "ลำดับข้อความไม่ถูกต้อง" };
    if (typeof content !== "string" || content.trim().length === 0) return { error: "ข้อความว่าง" };
    if (content.length > LIMITS.messageChars * (role === "assistant" ? 4 : 1)) return { error: "ข้อความยาวเกินไป" };
    clean.push({ role: expected, content });
  }
  if (clean.at(-1)!.role !== "user") return { error: "ข้อความสุดท้ายต้องเป็นคำถาม" };
  return { system, context, messages: clean };
}

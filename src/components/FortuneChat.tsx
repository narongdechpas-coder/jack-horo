"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat/request";

// ตั้งไว้ใน netlify.toml เท่านั้น บน GitHub Pages ไม่มี server จึงซ่อนแชท
const ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT;

interface Props {
  /** ชื่อศาสตร์ เช่น "ไพ่ยิปซี" */
  systemName: string;
  /** ผลดวงที่แปลงเป็นข้อความแล้ว (src/lib/chat/context.ts) */
  context: string;
  suggestions: string[];
}

/** แชทถามหมอดู AI ต่อจากผลดวงที่แสดงอยู่ (ใส่ key={context} เพื่อเริ่มใหม่เมื่อผลเปลี่ยน) */
export function FortuneChat({ systemName, context, suggestions }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages]);

  if (!ENDPOINT) return null;

  // คำตอบที่ error ไม่ส่งกลับไปเป็นประวัติแชท
  const failed = messages.at(-1)?.content.startsWith("⚠️") ?? false;

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    // ถ้าคำตอบล่าสุด error ให้ตัดคู่คำถาม-คำตอบนั้นออกก่อนถามใหม่
    const base = failed ? messages.slice(0, -2) : messages;
    const history: ChatMessage[] = [...base, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    const write = (text: string) =>
      setMessages((ms) => [...ms.slice(0, -1), { role: "assistant", content: text }]);
    try {
      const res = await fetch(ENDPOINT!, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ system: systemName, context, messages: history }),
      });
      if (!res.ok || !res.body) {
        write(`⚠️ ${(await res.text()) || "หมอดูติดขัดชั่วคราว ลองใหม่อีกครั้งนะ"}`);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        write(answer);
      }
      if (!answer.trim()) write("⚠️ หมอดูไม่ได้ตอบกลับมา ลองถามใหม่อีกครั้งนะ");
    } catch {
      write("⚠️ เชื่อมต่อหมอดูไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่นะ");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-[var(--accent)] bg-[var(--surface)] p-4 text-left"
        data-testid="chat-open"
      >
        <span className="text-2xl" aria-hidden>🔮</span>
        <span>
          <span className="block font-semibold text-[var(--accent-text)]">ถามหมอดูต่อ</span>
          <span className="block text-sm text-[var(--muted)]">อ่านแล้วงง? ให้หมอดู AI อธิบายผลนี้ หรือถามเรื่องที่อยากรู้เพิ่ม</span>
        </span>
      </button>
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-[var(--accent)] bg-[var(--surface)] p-4" data-testid="chat">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--accent-text)]">🔮 หมอดู AI</h3>
        {messages.length > 0 && !loading && (
          <button type="button" onClick={() => setMessages([])} className="text-sm text-[var(--muted)]">
            เริ่มใหม่
          </button>
        )}
      </div>

      <div className="space-y-3" aria-live="polite">
        {messages.length === 0 && (
          <p className="text-sm text-[var(--muted)]">หมอดูอ่านผลของคุณแล้ว เลือกคำถามด้านล่างหรือพิมพ์ถามเองได้เลย</p>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="ml-8 rounded-lg bg-[var(--accent)] px-3 py-2 text-[var(--on-accent)]">
              {m.content}
            </div>
          ) : (
            <div key={i} className="mr-4 whitespace-pre-wrap rounded-lg bg-[var(--surface-2)] px-3 py-2 leading-relaxed" data-testid="chat-answer">
              {m.content || <span className="text-[var(--muted)]">หมอดูกำลังพิจารณา…</span>}
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      {!loading && (messages.length === 0 || failed) && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void ask(s)}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-sm hover:border-[var(--accent)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder="พิมพ์คำถามถึงหมอดู…"
          disabled={loading}
          className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary min-h-11 rounded-lg px-4 py-2 font-semibold disabled:opacity-40"
        >
          ถาม
        </button>
      </form>
      <p className="text-xs text-[var(--muted)]">คำตอบจาก AI เพื่อความบันเทิง อาจคลาดเคลื่อนได้</p>
    </section>
  );
}

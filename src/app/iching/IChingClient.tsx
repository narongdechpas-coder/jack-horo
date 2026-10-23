"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { coinsToLine, isChanging, isYang, parseLines, readIChing, tossCoins, type Hexagram, type LineValue } from "@/lib/systems/iching/cast";
import { interpretIChing } from "@/lib/systems/iching/story";
import { ReadingList } from "@/components/ReadingList";
import { FortuneChat } from "@/components/FortuneChat";
import { ichingContext } from "@/lib/chat/context";

/** เส้นของฉาก แสดงจากบน (เส้นที่ 6) ลงล่าง (เส้นที่ 1) */
function HexagramFigure({ lines, changing = [], label }: { lines: number[]; changing?: number[]; label: string }) {
  return (
    <div className="flex flex-col gap-1.5" role="img" aria-label={label}>
      {[...lines.keys()].reverse().map((i) => {
        const moving = changing.includes(i + 1);
        const color = moving ? "bg-[var(--neon-jade)]" : "bg-[var(--text)]";
        return (
          <div key={i} className="flex h-3 w-24 items-center gap-2 sm:w-28">
            {lines[i] ? (
              <span className={`h-full flex-1 rounded-sm ${color}`} />
            ) : (
              <>
                <span className={`h-full flex-1 rounded-sm ${color}`} />
                <span className={`h-full flex-1 rounded-sm ${color}`} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HexagramCard({ h, changing, title }: { h: Hexagram; changing?: number[]; title: string }) {
  return (
    <div className="panel flex flex-1 flex-col items-center gap-3 rounded-xl p-4 text-center">
      <div className="text-sm text-[var(--muted)]">{title}</div>
      <HexagramFigure lines={h.lines} changing={changing} label={`ฉากที่ ${h.number} ${h.lore.th}`} />
      <div>
        <div className="text-xs text-[var(--muted)]">ฉากที่ {h.number}</div>
        <div className="text-2xl font-bold" lang="zh">
          {h.zh} <span className="text-base font-normal text-[var(--muted)]">{h.pinyin}</span>
        </div>
        <div className="font-semibold text-[var(--cat-jade)]">{h.lore.th}</div>
        <div className="text-xs text-[var(--muted)]">
          {h.upper.th} {h.upper.symbol} บน {h.lower.th} {h.lower.symbol}
        </div>
      </div>
      <p className="text-sm text-[var(--muted)]" lang="zh">
        {h.judgment}
      </p>
    </div>
  );
}

export function IChingClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const qLines = params.get("l");
  const qQuestion = params.get("q") ?? "";
  const values = useMemo(() => parseLines(qLines), [qLines]);
  const reading = useMemo(() => (values ? readIChing(values, qQuestion) : null), [values, qQuestion]);

  const [question, setQuestion] = useState("");
  const [cast, setCast] = useState<LineValue[]>([]);
  const [coins, setCoins] = useState<boolean[] | null>(null);
  const [flipKey, setFlipKey] = useState(0);

  function finish(all: LineValue[]) {
    const q = new URLSearchParams({ l: all.join("") });
    if (question.trim()) q.set("q", question.trim());
    router.push(`${pathname}?${q}`);
  }

  function tossOne() {
    const c = tossCoins();
    const next = [...cast, coinsToLine(c)];
    setCoins(c);
    setFlipKey((k) => k + 1);
    setCast(next);
    if (next.length === 6) setTimeout(() => finish(next), 700);
  }

  function tossAll() {
    const next = [...cast];
    while (next.length < 6) next.push(coinsToLine(tossCoins()));
    finish(next);
  }

  function restart() {
    setCast([]);
    setCoins(null);
    setQuestion("");
    router.push(pathname);
  }

  if (reading) {
    return (
      <div className="space-y-8">
        <section className="space-y-4">
          {reading.question && <p className="text-lg">คำถาม: “{reading.question}”</p>}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center" data-testid="hexagrams">
            <HexagramCard h={reading.primary} changing={reading.changing} title="ฉากหลัก · ตอนนี้" />
            {reading.result && (
              <>
                <div className="text-center text-2xl text-[var(--cat-jade)]" aria-hidden>
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </div>
                <HexagramCard h={reading.result} title="ฉากผลลัพธ์ · ทิศทาง" />
              </>
            )}
          </div>
          {reading.changing.length > 0 && (
            <p className="text-center text-sm text-[var(--muted)]">เส้นสีเขียวคือเส้นที่กำลังเปลี่ยน (เหรียญได้ 6 หรือ 9)</p>
          )}
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">คำทำนาย</h2>
          <ReadingList items={interpretIChing(reading)} />
        </section>
        <FortuneChat
          key={`${qLines}-${qQuestion}`}
          systemName="อี้จิง"
          context={ichingContext(reading)}
          suggestions={["ฉากนี้ตอบคำถามของฉันว่าอะไร", "เส้นที่เปลี่ยนบอกอะไร", "ควรทำอย่างไรต่อ"]}
        />
        <p className="text-xs text-[var(--muted)]">คัดลอกลิงก์ของหน้านี้ไปแชร์ได้ คนที่เปิดลิงก์จะเห็นผลเดียวกับคุณ</p>
        <button type="button" onClick={restart} className="btn-primary min-h-11 rounded-lg px-5 py-2 font-semibold">
          ☯ ถามใหม่
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
      <label className="block space-y-2">
        <span className="text-sm font-semibold">1. ตั้งคำถามในใจ (พิมพ์ไว้ได้ ไม่บังคับ)</span>
        <input
          type="text"
          value={question}
          maxLength={200}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="เช่น ควรเปลี่ยนงานตอนนี้ไหม"
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
        />
      </label>

      <div className="space-y-3">
        <div className="text-sm font-semibold">2. โยนเหรียญ 6 ครั้ง เส้นจะก่อตัวจากล่างขึ้นบน</div>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
          <div className="flex gap-3" aria-live="polite" data-testid="coins">
            {(coins ?? [true, false, true]).map((head, i) => (
              <span key={`${flipKey}-${i}`} className="flex flex-col items-center gap-1">
                <span
                  className={`coin h-14 w-14 rounded-full ${coins ? "coin-flip" : "opacity-60"}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                  aria-hidden
                />
                <span className="h-4 text-xs text-[var(--muted)]">{coins ? (head ? "หัว" : "ก้อย") : ""}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-col-reverse gap-1.5" data-testid="cast-lines">
            {Array.from({ length: 6 }, (_, i) => {
              const v = cast[i];
              const base = "h-3 flex-1 rounded-sm";
              return (
                <div key={i} className="flex w-32 items-center gap-2">
                  <span className="w-4 text-right text-xs text-[var(--muted)]">{i + 1}</span>
                  {v === undefined ? (
                    <span className={`${base} border border-dashed border-[var(--border)]`} />
                  ) : isYang(v) ? (
                    <span className={`${base} animate-card-in ${isChanging(v) ? "bg-[var(--neon-jade)]" : "bg-[var(--text)]"}`} />
                  ) : (
                    <>
                      <span className={`${base} animate-card-in ${isChanging(v) ? "bg-[var(--neon-jade)]" : "bg-[var(--text)]"}`} />
                      <span className={`${base} animate-card-in ${isChanging(v) ? "bg-[var(--neon-jade)]" : "bg-[var(--text)]"}`} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={tossOne} disabled={cast.length >= 6} className="btn-primary min-h-11 rounded-lg px-5 py-2 font-semibold disabled:opacity-50">
            🪙 โยนเหรียญ ({Math.min(cast.length + 1, 6)}/6)
          </button>
          <button type="button" onClick={tossAll} disabled={cast.length >= 6} className="btn-secondary min-h-11 rounded-lg px-4 py-2 disabled:opacity-50">
            โยนที่เหลือทั้งหมด
          </button>
        </div>
        <p className="text-center text-xs text-[var(--muted)]">หัว = 3 ก้อย = 2 ผลรวม 6 หรือ 9 คือเส้นที่กำลังเปลี่ยน (สีเขียว)</p>
      </div>
    </div>
  );
}

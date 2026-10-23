"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

/** เหรียญจีนโบราณ: หัวมีอักษร 開元通寶 รอบรูสี่เหลี่ยม ก้อยเป็นด้านเรียบ */
function Coin({ heads, className = "", style }: { heads: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`coin ${heads ? "coin-heads" : "coin-tails"} h-14 w-14 rounded-full ${className}`} style={style} aria-hidden>
      {heads && (
        <>
          <span className="coin-char top-0.5 left-1/2 -translate-x-1/2">開</span>
          <span className="coin-char bottom-0.5 left-1/2 -translate-x-1/2">元</span>
          <span className="coin-char right-1 top-1/2 -translate-y-1/2">通</span>
          <span className="coin-char left-1 top-1/2 -translate-y-1/2">寶</span>
        </>
      )}
    </span>
  );
}

/** เวลาที่เหรียญลอยและพลิกก่อนตกถึงพื้น (ตรงกับ coin-flip ใน globals.css) */
const FLIP_MS = 1100;

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
  // idle → shaking (กดค้างเขย่าเหรียญ) → flipping (ปล่อยแล้วเหรียญลอย) → idle
  const [phase, setPhase] = useState<"idle" | "shaking" | "flipping">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function finish(all: LineValue[]) {
    const q = new URLSearchParams({ l: all.join("") });
    if (question.trim()) q.set("q", question.trim());
    router.push(`${pathname}?${q}`);
  }

  function startShake() {
    if (phase === "idle" && cast.length < 6) setPhase("shaking");
  }

  function release() {
    if (phase !== "shaking") return;
    const c = tossCoins();
    setCoins(c);
    setFlipKey((k) => k + 1);
    setPhase("flipping");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => {
      const next = [...cast, coinsToLine(c)];
      setCast(next);
      setPhase("idle");
      if (next.length === 6) timer.current = setTimeout(() => finish(next), 700);
    }, reduced ? 250 : FLIP_MS);
  }

  function tossAll() {
    const next = [...cast];
    while (next.length < 6) next.push(coinsToLine(tossCoins()));
    finish(next);
  }

  function restart() {
    clearTimeout(timer.current);
    setPhase("idle");
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
          <div className="flex gap-3" data-testid="coins">
            {(coins ?? [true, true, true]).map((head, i) => {
              const landed = phase === "idle" && coins;
              const motion = phase === "shaking" ? "coin-shake" : phase === "flipping" ? "coin-flip" : "";
              return (
                <span key={`${flipKey}-${i}`} className="flex flex-col items-center gap-1">
                  <Coin
                    heads={phase === "shaking" || head}
                    className={`${motion} ${coins || phase !== "idle" ? "" : "opacity-60"}`}
                    style={{ animationDelay: `${i * 90}ms` }}
                  />
                  <span className="h-4 text-xs text-[var(--muted)]" aria-live="polite">
                    {landed ? (head ? "หัว" : "ก้อย") : ""}
                  </span>
                </span>
              );
            })}
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
          <button
            type="button"
            disabled={cast.length >= 6 || phase === "flipping"}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              startShake();
            }}
            onPointerUp={release}
            onPointerCancel={release}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault();
                startShake();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") release();
            }}
            onContextMenu={(e) => e.preventDefault()}
            style={{ touchAction: "none" }}
            className="btn-primary min-h-11 select-none rounded-lg px-5 py-2 font-semibold disabled:opacity-50"
            data-testid="toss"
          >
            {phase === "shaking" ? "🤲 กำลังเขย่า… ปล่อยเพื่อโยน" : phase === "flipping" ? "🪙 เหรียญกำลังลอย…" : `🪙 กดค้างเพื่อเขย่าเหรียญ (${Math.min(cast.length + 1, 6)}/6)`}
          </button>
          <button type="button" onClick={tossAll} disabled={cast.length >= 6 || phase !== "idle"} className="btn-secondary min-h-11 rounded-lg px-4 py-2 disabled:opacity-50">
            โยนที่เหลือทั้งหมด
          </button>
        </div>
        <p className="text-center text-xs text-[var(--muted)]">
          ตั้งจิตถึงคำถาม กดปุ่มค้างไว้เพื่อเขย่าเหรียญ แล้วปล่อยเพื่อโยน · หัว (ด้านมีอักษร) = 3 ก้อย (ด้านเรียบ) = 2 ผลรวม 6 หรือ 9 คือเส้นที่กำลังเปลี่ยน (สีเขียว)
        </p>
      </div>
    </div>
  );
}

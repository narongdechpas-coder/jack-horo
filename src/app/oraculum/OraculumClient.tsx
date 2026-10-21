"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { QUESTIONS, type Tone } from "@/lib/systems/oraculum/data";
import { LINES, parseOracleParams, readOracle } from "@/lib/systems/oraculum/oracle";

interface Dash {
  height: number;
  rotate: number;
  shift: number;
}

const randomDash = (): Dash => ({ height: 16 + Math.random() * 8, rotate: -28 + Math.random() * 56, shift: -3 + Math.random() * 6 });

const TONE_DOT: Record<Tone, string> = {
  favorable: "bg-[var(--gold)]",
  mixed: "bg-amber-600",
  wait: "bg-teal-600",
  caution: "bg-rose-600",
};

export function OraculumClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const parsed = useMemo(() => parseOracleParams(params.get("q"), params.get("c")), [params]);
  const reading = parsed ? readOracle(parsed.questionIndex, parsed.counts) : null;

  const [question, setQuestion] = useState<number | null>(null);
  const [lines, setLines] = useState<Dash[][]>(() => Array.from({ length: LINES }, () => []));

  function startDraw(q: number) {
    setQuestion(q);
    setLines(Array.from({ length: LINES }, () => []));
    if (reading) router.push(pathname);
  }

  function tap(i: number) {
    setLines((ls) => ls.map((l, j) => (j === i ? [...l, randomDash()] : l)));
  }

  function clearLine(i: number) {
    setLines((ls) => ls.map((l, j) => (j === i ? [] : l)));
  }

  function randomAll() {
    setLines(Array.from({ length: LINES }, () => Array.from({ length: 3 + Math.floor(Math.random() * 12) }, randomDash)));
  }

  function reveal() {
    const q = new URLSearchParams({ q: String(question), c: lines.map((l) => l.length).join(",") });
    router.push(`${pathname}?${q}`);
  }

  const ready = lines.every((l) => l.length > 0);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <section className="space-y-2 text-center">
        <div className="text-xs tracking-[0.4em] text-[var(--gold)]">ORACULUM</div>
        <h1 className="text-2xl font-semibold">ตำราพยากรณ์นโปเลียน</h1>
        <p className="text-[var(--muted)]">✦ ✦ ✦</p>
      </section>

      {reading ? (
        <section className="animate-card-in space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4" aria-label="ผังขีดทั้ง 5 บรรทัด">
              {reading.bits.map((b, i) => (
                <div key={i} className="flex justify-center gap-2.5 text-[var(--gold)]">
                  ●{b === 0 && <span>●</span>}
                </div>
              ))}
            </div>
            <div className="text-xs text-[var(--muted)]">ขีดจำนวนคี่ = ● · คู่ = ● ●</div>
          </div>

          <div className="rounded-2xl border border-[var(--gold)] bg-[var(--surface)] p-6 text-center shadow-sm">
            <div className="text-xs tracking-widest text-[var(--muted)]">คำถามของเจ้า</div>
            <div className="mt-1 text-[var(--text)]">{reading.question}</div>
            <div className="mt-5 text-3xl font-semibold" data-testid="symbol">{reading.symbol.name}</div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${TONE_DOT[reading.symbol.tone]}`} aria-hidden />
              {reading.toneLabel}
            </div>
            <p className="mt-5 leading-loose">“{reading.symbol.verse}”</p>
            <p className="mt-4 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">{reading.guide}</p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => startDraw(parsed!.questionIndex)} className="flex-1 rounded-lg border border-[var(--accent)] px-4 py-3 text-[var(--accent)]">
              ↺ ขีดใหม่
            </button>
            <button type="button" onClick={() => { setQuestion(null); router.push(pathname); }} className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--on-accent)]">
              ✦ ถามใหม่
            </button>
          </div>
          <p className="text-center text-xs text-[var(--muted)]">คัดลอกลิงก์ของหน้านี้ไปแชร์ได้ คนที่เปิดจะเห็นคำทำนายเดียวกัน</p>
        </section>
      ) : question === null ? (
        <section className="animate-card-in space-y-2">
          <p className="mb-4 text-center text-[var(--muted)]">ตั้งจิตให้นิ่ง แล้วเลือกคำถามที่ค้างคาใจหนึ่งข้อ</p>
          {QUESTIONS.map((q, i) => (
            <button
              key={q}
              type="button"
              onClick={() => startDraw(i)}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left transition hover:border-[var(--accent)]"
            >
              <span className="text-xs text-[var(--gold)]">✦</span>
              {q}
            </button>
          ))}
        </section>
      ) : (
        <section className="animate-card-in space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center">
            <div className="text-xs tracking-widest text-[var(--muted)]">คำถามของเจ้า</div>
            <div className="mt-1 font-semibold">{QUESTIONS[question]}</div>
          </div>
          <p className="text-center text-[var(--muted)]">
            แตะแต่ละบรรทัดหลาย ๆ ครั้ง <b className="text-[var(--text)]">โดยไม่ต้องนับ</b>
            <br />
            (อย่างน้อยบรรทัดละ 1 ขีด) แล้วปล่อยให้โชคชะตากำหนด
          </p>
          <div className="space-y-3" data-testid="lines">
            {lines.map((dashes, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-center text-[var(--gold)]">{i + 1}</span>
                <button
                  type="button"
                  onClick={() => tap(i)}
                  aria-label={`บรรทัดที่ ${i + 1} แตะเพื่อขีด`}
                  className="flex min-h-[52px] flex-1 flex-wrap items-center gap-1.5 rounded-lg border border-[var(--border)] border-b-2 border-b-[var(--gold)] bg-[var(--surface)] px-3 py-2"
                >
                  {dashes.length === 0 && <span className="text-sm text-[var(--muted)]">แตะเพื่อขีด…</span>}
                  {dashes.map((d, k) => (
                    <span
                      key={k}
                      className="animate-card-in inline-block w-[2.5px] rounded-sm bg-[var(--accent)]"
                      style={{ height: d.height, transform: `rotate(${d.rotate}deg) translateX(${d.shift}px)` }}
                    />
                  ))}
                </button>
                <button type="button" onClick={() => clearLine(i)} aria-label={`ลบบรรทัดที่ ${i + 1}`} className="w-7 text-lg text-[var(--muted)]">
                  ↺
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={randomAll} className="flex-1 rounded-lg border border-[var(--accent)] px-4 py-3 text-[var(--accent)]">
              🎲 สุ่มให้ทั้งหมด
            </button>
            <button
              type="button"
              onClick={reveal}
              disabled={!ready}
              className="flex-[1.4] rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--on-accent)] disabled:opacity-40"
            >
              ✦ เปิดคำทำนาย
            </button>
          </div>
          <button type="button" onClick={() => setQuestion(null)} className="mx-auto block text-sm text-[var(--muted)]">
            ‹ เปลี่ยนคำถาม
          </button>
        </section>
      )}

      <p className="text-center text-xs text-[var(--muted)]">กลไกอ้างอิงตำรา Oraculum ดั้งเดิม · คำทำนายเขียนขึ้นใหม่ทั้งหมด</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArtImage } from "@/components/site/Art";
import { BIRTH_DAYS, dailyTaksa, thaiDate, type Planet, type Tone } from "@/lib/systems/daily/taksa";

const STORAGE_KEY = "birth-day";

const TONE_COLOR: Record<Tone, string> = {
  good: "var(--tone-good)",
  neutral: "var(--tone-neutral)",
  caution: "var(--tone-caution)",
};

/** ดวงวันนี้ตามวันเกิด: ใช้หลักทักษา (src/lib/systems/daily/taksa.ts) คำนวณจากวันที่ในเครื่องผู้ใช้ */
export function DailyHoroscopePanel() {
  const [today, setToday] = useState<Date | null>(null);
  const [birth, setBirth] = useState<Planet | null>(null);

  useEffect(() => {
    setToday(new Date());
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY));
      if (BIRTH_DAYS.some((d) => d.planet === saved)) setBirth(saved as Planet);
    } catch {
      // storage unavailable: the visitor just picks again next time
    }
  }, []);

  function choose(p: Planet) {
    setBirth(p);
    try {
      localStorage.setItem(STORAGE_KEY, String(p));
    } catch {
      // ignore
    }
  }

  const reading = today && birth ? dailyTaksa(birth, today) : null;

  return (
    <section id="daily" aria-labelledby="daily-title" className="panel panel-glow scroll-mt-20 overflow-hidden rounded-2xl">
      <div className="grid md:grid-cols-[minmax(0,14rem)_1fr]">
        <ArtImage
          name="daily"
          alt=""
          sizes="(min-width: 768px) 224px, 100vw"
          className="h-40 w-full object-cover object-[center_35%] md:h-full"
        />
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="daily-title" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-[var(--gold)]" aria-hidden>☾</span> ดวงวันนี้ตามวันเกิด
            </h2>
            <p className="text-sm text-[var(--muted)]" data-testid="daily-date">{today ? thaiDate(today) : " "}</p>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm text-[var(--muted)]">คุณเกิดวันอะไร?</legend>
            <div className="flex flex-wrap gap-2">
              {BIRTH_DAYS.map((d) => (
                <button
                  key={d.planet}
                  type="button"
                  onClick={() => choose(d.planet)}
                  aria-pressed={birth === d.planet}
                  className="min-h-11 rounded-full border border-[var(--border)] px-4 text-sm transition hover:border-[var(--neon-purple)] aria-pressed:border-transparent aria-pressed:bg-[var(--accent)] aria-pressed:font-semibold aria-pressed:text-[var(--on-accent)]"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </fieldset>

          {reading ? (
            <div className="space-y-3" aria-live="polite" data-testid="daily-reading">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border px-3 py-0.5 text-sm font-semibold"
                  style={{ color: TONE_COLOR[reading.tone], borderColor: TONE_COLOR[reading.tone] }}
                >
                  {reading.toneLabel}
                </span>
                <h3 className="text-lg font-bold">{reading.title}</h3>
              </div>
              <p className="leading-relaxed">{reading.story}</p>
              <p className="rounded-lg bg-[var(--surface-2)] px-3 py-2 text-sm leading-relaxed">
                <span className="font-semibold">💡 สิ่งที่ควรทำ: </span>
                {reading.advice}
              </p>
              <dl className="grid gap-1 text-sm sm:grid-cols-2">
                <div>
                  <dt className="inline text-[var(--muted)]">สีเสริมดวง: </dt>
                  <dd className="inline font-semibold">{reading.luckyColor}</dd>
                </div>
                <div>
                  <dt className="inline text-[var(--muted)]">สีที่ควรเลี่ยง: </dt>
                  <dd className="inline font-semibold">{reading.avoidColor}</dd>
                </div>
              </dl>
              <p className="text-xs text-[var(--muted)]">คำนวณตามหลักทักษา วันนี้ตกภูมิ “{reading.role}” ในดวงของคุณ</p>
            </div>
          ) : (
            <p className="text-[var(--muted)]">เลือกวันเกิดด้านบน แล้วดูว่าวันนี้เป็นวันดีหรือวันที่ควรระวังสำหรับคุณ</p>
          )}

          <Link href="/thai-seven" className="btn-secondary inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold">
            ดูดวงละเอียดด้วยเลข 7 ตัว <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TarotCard } from "@/components/TarotCard";
import { dailySeed } from "@/lib/systems/daily/taksa";
import { readTarot } from "@/lib/systems/tarot/spreads";

/** ไพ่ประจำวันจริง: seed จากวันที่ ทุกคนเห็นไพ่ใบเดียวกันทั้งวัน และภาพตรงกับชื่อไพ่เสมอ */
export function FeaturedTarotCard() {
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => setSeed(dailySeed(new Date())), []);
  const drawn = seed === null ? null : readTarot("daily", seed).cards[0];

  return (
    <section aria-labelledby="tarot-title" className="panel panel-glow flex flex-col gap-4 rounded-2xl p-5">
      <h2 id="tarot-title" className="flex items-center gap-2 text-xl font-bold">
        <span className="text-[var(--gold)]" aria-hidden>✦</span> ไพ่ประจำวัน
      </h2>
      {drawn ? (
        <div className="flex flex-1 gap-4" data-testid="daily-card">
          <div className="shrink-0">
            <TarotCard card={drawn.card} reversed={drawn.reversed} width="w-28" />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="text-lg font-bold">
              {drawn.card.nameTh}
              {drawn.reversed && <span className="ml-2 text-xs font-normal text-[var(--cat-magenta)]">กลับหัว</span>}
            </h3>
            <p className="text-sm text-[var(--muted)]">
              {drawn.card.nameEn} · {drawn.card.keyword}
            </p>
            <p className="text-sm leading-relaxed">{drawn.reversed ? drawn.card.reversed : drawn.card.upright}</p>
          </div>
        </div>
      ) : (
        <div className="h-48" aria-hidden />
      )}
      <p className="text-xs text-[var(--muted)]">ไพ่ใบนี้สุ่มจากวันที่ ทุกคนเห็นใบเดียวกันตลอดทั้งวัน</p>
      {seed !== null && (
        <Link
          href={`/tarot/?s=daily&seed=${seed}`}
          className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full px-5 text-sm font-semibold"
        >
          ดูคำทำนายเพิ่มเติม <span aria-hidden>→</span>
        </Link>
      )}
    </section>
  );
}

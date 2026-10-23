"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DECK, SUITS } from "@/lib/systems/playing-cards/deck";
import { SPREADS, getSpread, readSpread } from "@/lib/systems/playing-cards/spreads";
import { parsePicks } from "@/lib/random";
import { CardDrawFlow, type DrawResult } from "@/components/CardDrawFlow";
import { PlayingCard } from "@/components/PlayingCard";
import { FortuneChat } from "@/components/FortuneChat";
import { playingCardsContext } from "@/lib/chat/context";
import { CARD_LORE } from "@/lib/systems/playing-cards/lore";
import { TOPIC_LABEL, detectTopic } from "@/lib/systems/reading-kb";
import { ComboList } from "@/components/ComboList";

const FLOW_SPREADS = SPREADS.map((s) => ({ id: s.id, name: s.name, description: s.description, positions: s.positions }));

const TONE_LABEL = { good: "ดี", neutral: "กลาง ๆ", caution: "ระวัง" } as const;

export function PlayingCardsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const qSpread = params.get("s");
  const qSeed = params.get("seed");
  const qPick = params.get("pick");
  const qQuestion = params.get("q") ?? "";

  const reading = useMemo(() => {
    const seed = Number(qSeed);
    if (!qSpread || !qSeed || !Number.isInteger(seed) || seed < 0) return null;
    const picks = parsePicks(qPick, DECK.length, getSpread(qSpread).positions.length);
    return readSpread(qSpread, seed, picks);
  }, [qSpread, qSeed, qPick]);

  const topic = detectTopic(qQuestion);

  function reveal({ spreadId, seed, picks, question }: DrawResult) {
    const q = new URLSearchParams({ s: spreadId, seed: String(seed), pick: picks.join(",") });
    if (question) q.set("q", question);
    router.push(`${pathname}?${q}`);
  }

  return (
    <div className="space-y-8">

      {!reading && (
        <CardDrawFlow
          spreads={FLOW_SPREADS}
          deckSize={DECK.length}
          cardAspect="aspect-[5/7]"
          questionPlaceholder="เช่น งานใหม่จะเป็นอย่างไร"
          onReveal={reveal}
        />
      )}

      {reading && (
        <section className="space-y-4">
          {qQuestion && <p className="text-lg">คำถาม: “{qQuestion}”</p>}
          {/* flex + justify-center keeps a single daily card in the middle */}
          <div className="flex flex-wrap justify-center gap-4">
            {reading.cards.map(({ position, card }, i) => (
              <div
                key={card.id}
                className="animate-card-in flex w-full max-w-xs flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center sm:w-[calc((100%-2rem)/3)]"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="text-sm font-semibold text-[var(--gold)]">{position}</div>
                <PlayingCard card={card} />
                <div className="text-sm">
                  {card.rank} {SUITS[card.suit].name} · <span className="text-[var(--muted)]">{TONE_LABEL[card.tone]}</span>
                </div>
                <p className="text-sm leading-relaxed [text-wrap:balance]">{card.meaning}</p>
                {topic !== "general" && (
                  <p className="text-sm leading-relaxed [text-wrap:balance]">
                    <span className="font-semibold">ด้าน{TOPIC_LABEL[topic]}:</span> {CARD_LORE[card.id][topic]}
                  </p>
                )}
                <details className="w-full text-left text-sm">
                  <summary className="cursor-pointer py-1 text-center text-[var(--accent-text)]">อ่านเพิ่ม</summary>
                  <dl className="mt-1 space-y-1 leading-relaxed">
                    {topic !== "love" && <div><dt className="inline font-semibold">ความรัก: </dt><dd className="inline">{CARD_LORE[card.id].love}</dd></div>}
                    {topic !== "work" && <div><dt className="inline font-semibold">การงานและการเงิน: </dt><dd className="inline">{CARD_LORE[card.id].work}</dd></div>}
                    <div><dt className="inline font-semibold">คำแนะนำ: </dt><dd className="inline">{CARD_LORE[card.id].advice}</dd></div>
                  </dl>
                </details>
              </div>
            ))}
          </div>
          <ComboList combos={reading.combos} />
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h3 className="font-semibold text-[var(--accent-text)]">สรุปคำทำนาย</h3>
            <p className="mt-1 leading-relaxed">{reading.summary}</p>
          </div>
          <FortuneChat
            key={`${qSpread}-${qSeed}-${qPick}`}
            systemName="ไพ่ป๊อก"
            context={playingCardsContext(reading, qQuestion)}
            suggestions={["เล่าไพ่ทั้งหมดเป็นเรื่องเดียวให้ฟังหน่อย", "ไพ่ที่ออกมาด้วยกันส่งผลต่อกันยังไง", "มีเรื่องอะไรที่ต้องระวังไหม"]}
          />
          <p className="text-xs text-[var(--muted)]">คัดลอกลิงก์ของหน้านี้ไปแชร์ได้ คนที่เปิดลิงก์จะเห็นไพ่ชุดเดียวกับคุณ</p>
          <button type="button" onClick={() => router.push(pathname)} className="btn-primary min-h-11 rounded-lg px-5 py-2 font-semibold">
            🔀 ดูดวงใหม่
          </button>
        </section>
      )}
    </div>
  );
}

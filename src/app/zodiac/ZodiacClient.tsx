"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isFutureDate, parseISODate, useToday } from "@/lib/date";
import { PLANET_ORDER, calculateZodiac, type ZodiacChart } from "@/lib/systems/zodiac/chart";
import { ELEMENT_INFO, PLANETS, SIGNS, degreeLabel } from "@/lib/systems/zodiac/lore";
import { DEFAULT_PROVINCE, PROVINCES } from "@/lib/systems/zodiac/provinces";
import { interpretZodiac } from "@/lib/systems/zodiac/story";
import { ReadingList } from "@/components/ReadingList";
import { FortuneChat } from "@/components/FortuneChat";
import { zodiacContext } from "@/lib/chat/context";

function compute(date: string | null, time: string | null, province: string | null): { result?: ZodiacChart; error?: string } {
  if (!date) return {};
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return { error: "รูปแบบวันที่ไม่ถูกต้อง" };
  if (isFutureDate(date)) return { error: "วันเกิดต้องไม่เกินวันนี้" };
  try {
    return { result: calculateZodiac({ year: +m[1], month: +m[2], day: +m[3], time: time || undefined, province: province || undefined }) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function ZodiacClient() {
  const params = useSearchParams();
  const today = useToday();
  const router = useRouter();
  const pathname = usePathname();
  const qDate = params.get("d");
  const qTime = params.get("t");
  const qPlace = params.get("p");
  const [date, setDate] = useState(qDate ?? "");
  const [time, setTime] = useState(qTime ?? "");
  const [place, setPlace] = useState(qPlace ?? DEFAULT_PROVINCE);
  const { result, error } = useMemo(() => compute(qDate, qTime, qPlace), [qDate, qTime, qPlace]);
  // วันนี้รู้ได้หลังเปิดหน้าในเบราว์เซอร์เท่านั้น (เว็บเป็น static)
  const todayDate = useMemo(() => parseISODate(today), [today]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({ d: date });
    if (time) q.set("t", time);
    if (place && place !== DEFAULT_PROVINCE) q.set("p", place);
    router.push(`${pathname}?${q}`);
  }

  const input = "rounded-lg border border-[var(--border)] bg-transparent px-3 py-2";

  const bigThree = result
    ? [
        { label: "ราศีดวงอาทิตย์", hint: "ตัวตนหลัก", p: result.planets.sun, uncertain: result.sunUncertain },
        { label: "ราศีดวงจันทร์", hint: "อารมณ์และจิตใจ", p: result.planets.moon, uncertain: result.moonUncertain },
        ...(result.ascendant ? [{ label: "ลัคนา", hint: "ภาพที่คนอื่นเห็น", p: result.ascendant, uncertain: false }] : []),
      ]
    : [];

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-col gap-1 text-sm">
          วันเกิด
          <input type="date" required min="1920-01-01" max={today} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          เวลาเกิด (ไม่บังคับ)
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={input} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          จังหวัดเกิด (ใช้หาลัคนา)
          <select value={place} onChange={(e) => setPlace(e.target.value)} className={`${input} bg-[var(--surface)]`}>
            {PROVINCES.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-primary min-h-11 rounded-lg px-5 py-2 font-semibold">
          ดูดวง
        </button>
        <p className="w-full text-xs text-[var(--muted)]">
          ถ้าไม่ใส่เวลาเกิดจะไม่มีลัคนา ถ้าเกิดต่างประเทศให้เลือกจังหวัดใดก็ได้ ราศีดวงอาทิตย์และดวงจันทร์ยังถูกต้อง แต่ลัคนาจะคลาดเคลื่อน
        </p>
      </form>

      {error && <p className="text-rose-500">{error}</p>}

      {result && (
        <>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">ราศีหลักของคุณ</h2>
            <ul className="grid gap-3 sm:grid-cols-3" data-testid="big-three">
              {bigThree.map(({ label, hint, p, uncertain }) => {
                const s = SIGNS[p.sign];
                return (
                  <li key={label} className="panel rounded-xl p-4 text-center">
                    <div className="text-sm text-[var(--muted)]">{label}</div>
                    <div className="mt-1 text-4xl text-[var(--cat-orange)]" aria-hidden>{s.glyph}</div>
                    <div className="mt-1 text-lg font-bold">{s.th}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {hint} · ธาตุ{ELEMENT_INFO[s.element].th}
                      {uncertain && " · ยังไม่แน่ชัด"}
                    </div>
                  </li>
                );
              })}
            </ul>
            {!result.hasTime && <p className="text-sm text-[var(--muted)]">ใส่เวลาเกิดเพื่อดูลัคนา (ภาพที่คนอื่นเห็น)</p>}
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">คำทำนาย</h2>
            <ReadingList items={interpretZodiac(result, todayDate)} />
          </section>

          <FortuneChat
            key={`${qDate}-${qTime}-${qPlace}`}
            systemName="12 ราศี"
            context={zodiacContext(result, todayDate)}
            suggestions={["ดวงวันนี้เป็นยังไง", "ปีนี้และปีหน้าดวงเป็นยังไง", "ราศีไหนเข้ากับฉันที่สุด"]}
          />

          <details className="rounded-xl border border-[var(--border)] p-4">
            <summary className="cursor-pointer font-semibold">ตำแหน่งดาวกำเนิด (สำหรับผู้สนใจโหราศาสตร์)</summary>
            <table className="mt-3 w-full text-sm" data-testid="planet-table">
              <tbody>
                {PLANET_ORDER.map((key) => {
                  const p = result.planets[key];
                  return (
                    <tr key={key} className="border-b border-[var(--border)]">
                      <th scope="row" className="py-2 text-left font-semibold">{PLANETS[key].th}</th>
                      <td className="py-2">{SIGNS[p.sign].glyph} {SIGNS[p.sign].th} {Math.floor(p.degree)}°</td>
                      <td className="hidden py-2 text-[var(--muted)] sm:table-cell">{PLANETS[key].meaning}</td>
                    </tr>
                  );
                })}
                {result.ascendant && (
                  <tr>
                    <th scope="row" className="py-2 text-left font-semibold">ลัคนา</th>
                    <td className="py-2">{SIGNS[result.ascendant.sign].glyph} {SIGNS[result.ascendant.sign].th} {Math.floor(result.ascendant.degree)}°</td>
                    <td className="hidden py-2 text-[var(--muted)] sm:table-cell">{degreeLabel(result.ascendant.degree)} · คำนวณจาก{result.province.name}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-[var(--muted)]">
              ใช้ราศีแบบสากล (Tropical) ซึ่งเริ่มที่จุดวสันตวิษุวัต ราศีแบบไทยเลื่อนไปจากนี้ราว 24 วัน จึงอาจไม่ตรงกับราศีที่เคยดูจากตำราไทย
            </p>
          </details>
          <p className="text-xs text-[var(--muted)]">คัดลอกลิงก์ของหน้านี้ไปแชร์ได้ คนที่เปิดลิงก์จะเห็นดวงเดียวกับคุณ</p>
        </>
      )}
    </div>
  );
}

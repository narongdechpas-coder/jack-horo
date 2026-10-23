"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isFutureDate, parseISODate, useToday } from "@/lib/date";
import { isValidDate } from "@/lib/systems/numerology/calc";
import { NUMBER_LORE, PERSONAL_YEAR } from "@/lib/systems/numerology/lore";
import { calculateNumerology, interpretNumerology, personalYearOf, type NumerologyResult } from "@/lib/systems/numerology/story";
import { ReadingList } from "@/components/ReadingList";
import { FortuneChat } from "@/components/FortuneChat";
import { numerologyContext } from "@/lib/chat/context";

function compute(date: string | null, name: string | null, thaiName: string | null): { result?: NumerologyResult; error?: string } {
  if (!date) return {};
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m || !isValidDate(+m[1], +m[2], +m[3])) return { error: "รูปแบบวันที่ไม่ถูกต้อง" };
  if (isFutureDate(date)) return { error: "วันเกิดต้องไม่เกินวันนี้" };
  return {
    result: calculateNumerology({ year: +m[1], month: +m[2], day: +m[3], name: name?.trim() || undefined, thaiName: thaiName?.trim() || undefined }),
  };
}

export function NumerologyClient() {
  const params = useSearchParams();
  const today = useToday();
  const router = useRouter();
  const pathname = usePathname();
  const qDate = params.get("d");
  const qName = params.get("n");
  const qThai = params.get("t");
  const [date, setDate] = useState(qDate ?? "");
  const [name, setName] = useState(qName ?? "");
  const [thaiName, setThaiName] = useState(qThai ?? "");
  const { result, error } = useMemo(() => compute(qDate, qName, qThai), [qDate, qName, qThai]);
  // วันนี้รู้ได้หลังเปิดหน้าในเบราว์เซอร์เท่านั้น (เว็บเป็น static)
  const todayDate = useMemo(() => parseISODate(today), [today]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({ d: date });
    if (name.trim()) q.set("n", name.trim());
    if (thaiName.trim()) q.set("t", thaiName.trim());
    router.push(`${pathname}?${q}`);
  }

  const input = "rounded-lg border border-[var(--border)] bg-transparent px-3 py-2";
  const hasThai = /[฀-๿]/.test(name);

  const tiles = result
    ? [
        { label: "เลขเส้นทางชีวิต", n: result.core.lifePath },
        { label: "เลขวันเกิด", n: result.core.birthday },
        ...(todayDate ? [{ label: `ปีส่วนตัว ${todayDate.getFullYear() + 543}`, n: personalYearOf(result, todayDate.getFullYear()), year: true }] : []),
        ...(result.name ? [{ label: "เลขจากชื่ออังกฤษ", n: result.name.expression }] : []),
        ...(result.thaiName ? [{ label: `ชื่อไทย (ผลรวม ${result.thaiName.total})`, n: result.thaiName.reduced }] : []),
      ]
    : [];

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <label className="flex flex-col gap-1 text-sm">
          วันเกิด
          <input type="date" required min="1900-01-01" max={today} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
        </label>
        <label className="flex min-w-56 flex-1 flex-col gap-1 text-sm">
          ชื่อ-นามสกุลภาษาอังกฤษ (ไม่บังคับ)
          <input
            type="text"
            value={name}
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น ตามพาสปอร์ต SOMCHAI JAIDEE"
            className={input}
            autoComplete="name"
          />
        </label>
        <label className="flex min-w-56 flex-1 flex-col gap-1 text-sm">
          ชื่อ-นามสกุลภาษาไทย (ไม่บังคับ)
          <input
            type="text"
            value={thaiName}
            maxLength={80}
            onChange={(e) => setThaiName(e.target.value)}
            placeholder="เช่น สมชาย ใจดี"
            className={input}
          />
        </label>
        <button type="submit" className="btn-primary min-h-11 rounded-lg px-5 py-2 font-semibold">
          ดูดวง
        </button>
        {hasThai && <p className="w-full text-xs text-rose-500">ช่องชื่อภาษาอังกฤษใช้ได้เฉพาะ A–Z ถ้าจะดูชื่อไทยให้พิมพ์ในช่องชื่อภาษาไทย</p>}
      </form>

      {error && <p className="text-rose-500">{error}</p>}

      {result && (
        <>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">ตัวเลขของคุณ</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" data-testid="numbers">
              {tiles.map(({ label, n, year }) => (
                <li key={label} className="panel rounded-xl p-4 text-center">
                  <div className="text-xs text-[var(--muted)]">{label}</div>
                  <div className="mt-1 text-4xl font-bold text-[var(--cat-teal)]">{n}</div>
                  <div className="mt-1 text-xs text-[var(--muted)]">{year ? PERSONAL_YEAR[n].theme : NUMBER_LORE[n].keyword}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">คำทำนาย</h2>
            <ReadingList items={interpretNumerology(result, todayDate)} />
          </section>

          <FortuneChat
            key={`${qDate}-${qName}-${qThai}`}
            systemName="เลขศาสตร์"
            context={numerologyContext(result, todayDate)}
            suggestions={["เลขของฉันบอกอะไรเกี่ยวกับตัวฉัน", "ปีนี้และปีหน้าเป็นยังไง", "ชื่อของฉันเสริมดวงไหม"]}
          />
          <p className="text-xs text-[var(--muted)]">
            เลขปีส่วนตัวเปลี่ยนทุกวันที่ 1 มกราคม ชื่อภาษาอังกฤษคำนวณด้วยตารางพีทาโกรัส ชื่อภาษาไทยใช้ตารางค่าอักษรไทยแบบที่นิยมที่สุด
            ซึ่งแต่ละสำนักอาจต่างกันเล็กน้อย
          </p>
        </>
      )}
    </div>
  );
}

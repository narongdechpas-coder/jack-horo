import { SOURCE_LABEL, type Combo } from "@/lib/systems/reading-kb";

/** "ไพ่ที่อ่านร่วมกัน": ความหมายที่เกิดจากไพ่หลายใบ พร้อมบอกว่ามาจากตำราไหน */
export function ComboList({ combos }: { combos: Combo[] }) {
  if (combos.length === 0) return null;
  const sources = [...new Set(combos.map((c) => c.source))];
  return (
    <div className="panel rounded-xl p-4" data-testid="combos">
      <h3 className="font-semibold text-[var(--accent-text)]">ไพ่ที่อ่านร่วมกัน</h3>
      <p className="text-sm text-[var(--muted)]">ไพ่แต่ละใบมีความหมายของตัวเอง แต่เมื่อออกมาด้วยกัน ความหมายจะเสริมหรือหักล้างกัน</p>
      <ul className="mt-3 space-y-3">
        {combos.map((c) => (
          <li key={c.title + c.text} className="border-l-2 border-[var(--neon-purple)] pl-3">
            <div className="font-semibold">{c.title}</div>
            <p className="leading-relaxed">{c.text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[var(--muted)]">อ้างอิง: {sources.map((s) => SOURCE_LABEL[s]).join(" · ")}</p>
    </div>
  );
}

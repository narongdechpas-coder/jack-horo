import Link from "next/link";
import { ArtImage } from "@/components/site/Art";
import { ORIGIN_LABELS, SYSTEMS, type SystemInfo } from "@/lib/systems/registry";

function AstrologyCategoryCard({ s }: { s: SystemInfo }) {
  const neon = `var(--neon-${s.accent})`;
  return (
    <li>
      <Link
        href={s.href}
        className="group panel flex h-full items-stretch overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:bg-[var(--surface-2)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-col"
        style={{ borderColor: `color-mix(in srgb, ${neon} 45%, var(--border))`, boxShadow: `0 10px 30px -18px ${neon}` }}
      >
        <div className="relative w-28 shrink-0 overflow-hidden sm:w-full">
          <ArtImage
            name={s.art}
            alt={s.artAlt}
            sizes="(min-width: 1024px) 230px, (min-width: 640px) 45vw, 112px"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none sm:aspect-[4/3] sm:h-auto"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-xs text-[var(--muted)]">{ORIGIN_LABELS[s.origin]}</span>
          <h3 className="text-lg font-bold" style={{ color: `var(--cat-${s.accent})` }}>
            {s.name}
          </h3>
          <p className="flex-1 text-sm leading-relaxed text-[var(--muted)]">{s.description}</p>
          <span
            aria-hidden
            className="mt-2 inline-flex h-9 w-9 items-center justify-center self-end rounded-full border text-lg transition group-hover:translate-x-0.5 motion-reduce:transition-none"
            style={{ borderColor: neon, color: `var(--cat-${s.accent})` }}
          >
            →
          </span>
        </div>
      </Link>
    </li>
  );
}

export function CategoryExplorer() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-20 space-y-5">
      <div className="space-y-1">
        <h2 id="categories-title" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-[var(--gold)]" aria-hidden>✦</span> เลือกศาสตร์ดูดวง
        </h2>
        <p className="text-[var(--muted)]">ศาสตร์ที่แตกต่าง แต่เป้าหมายเดียวกัน คือช่วยให้คุณเข้าใจตัวเองและมองเห็นเส้นทางข้างหน้า</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {SYSTEMS.map((s) => (
          <AstrologyCategoryCard key={s.id} s={s} />
        ))}
      </ul>
    </section>
  );
}

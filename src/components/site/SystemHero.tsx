import { ArtImage } from "@/components/site/Art";
import { ORIGIN_LABELS, SYSTEMS } from "@/lib/systems/registry";

/** ตั้งสีประจำศาสตร์ (--sys-neon) ให้ทั้งหน้า กล่องที่ใช้ .sys-panel จะเรืองแสงสีนี้ */
export function systemStyle(id: string): React.CSSProperties {
  const s = SYSTEMS.find((x) => x.id === id)!;
  return { "--sys-neon": `var(--neon-${s.accent})` } as React.CSSProperties;
}

interface Props {
  /** id ใน SYSTEMS (registry.ts) */
  id: string;
  /** คำอธิบายวิธีดูของหน้านี้ */
  children: React.ReactNode;
}

/**
 * แบนเนอร์หัวหน้าของแต่ละศาสตร์: ใช้ภาพและสีประจำศาสตร์ชุดเดียวกับการ์ดในหน้าแรก
 * ภาพเป็นโทนมืดทั้งหมด จึงใช้แผ่นไล่สีเข้มและตัวอักษรสีขาวได้ทั้งสองธีม
 */
export function SystemHero({ id, children }: Props) {
  const s = SYSTEMS.find((x) => x.id === id)!;
  const neon = `var(--neon-${s.accent})`;
  return (
    <section className="space-y-4">
      <div
        className="relative isolate overflow-hidden rounded-2xl border"
        style={{ borderColor: `color-mix(in srgb, ${neon} 50%, var(--border))`, boxShadow: `0 16px 44px -20px ${neon}` }}
      >
        <ArtImage
          name={s.art}
          alt=""
          priority
          sizes="(min-width: 896px) 864px, 100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050817] via-[#050817]/70 to-[#050817]/10" />
        <div className="flex min-h-48 flex-col justify-end gap-2 p-5 pt-20 sm:min-h-64 sm:p-7">
          <span
            className="w-fit rounded-full border px-3 py-0.5 text-xs font-semibold text-white backdrop-blur-sm"
            style={{ borderColor: neon, background: `color-mix(in srgb, ${neon} 22%, transparent)` }}
          >
            {ORIGIN_LABELS[s.origin]}
          </span>
          <h1 className="text-3xl font-bold text-white drop-shadow sm:text-4xl">{s.name}</h1>
        </div>
      </div>
      <p className="leading-relaxed text-[var(--muted)]">{children}</p>
    </section>
  );
}

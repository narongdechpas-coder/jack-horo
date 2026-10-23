import Link from "next/link";
import { SYSTEMS } from "@/lib/systems/registry";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-2)_60%,transparent)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-[var(--muted)] sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p>รวมศาสตร์ดูดวงจากไทย ตะวันตก และจีน ไว้ในที่เดียว</p>
          <p>คำทำนายทั้งหมดมีไว้เพื่อความบันเทิงและเป็นกำลังใจ โปรดใช้วิจารณญาณในการตัดสินใจเรื่องสำคัญ</p>
        </div>
        <nav aria-label="ศาสตร์ดูดวง">
          <h2 className="mb-2 font-semibold text-[var(--text)]">ศาสตร์ดูดวง</h2>
          <ul>
            {SYSTEMS.map((s) => (
              <li key={s.id}>
                <Link href={s.href} className="inline-flex min-h-11 items-center hover:text-[var(--text)]">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3">
          <h2 className="font-semibold text-[var(--text)]">ความเป็นส่วนตัว</h2>
          <p>
            การคำนวณดวงทำในเครื่องของคุณทั้งหมด เว็บไม่เก็บวันเกิดหรือคำถามไว้บนเซิร์ฟเวอร์
            ถ้าคุณใช้แชทหมอดู AI ผลดวงและข้อความแชทจะถูกส่งไปให้ Claude (Anthropic) เพื่อตอบคำถามเท่านั้น
          </p>
          <p className="text-xs">
            ภาพไพ่ยิปซีสำรับ Rider-Waite ปี 1909 (public domain) · ปฏิทินจันทรคติไทยพอร์ตจาก thailunar / pythaidate (MIT) ·
            ปาจื้อคำนวณด้วย lunar-typescript (MIT)
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex min-h-11 items-center gap-2 whitespace-nowrap text-lg font-bold" aria-label="Horoscope Hub หน้าแรก">
      {/* same glowing orb as the app icon and the AI chat */}
      <span className="ai-orb h-6 w-6 shrink-0 rounded-full" aria-hidden />
      <span>
        Horoscope <span className="text-[var(--accent-text)]">Hub</span>
      </span>
    </Link>
  );
}

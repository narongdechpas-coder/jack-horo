import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex min-h-11 items-center gap-2 whitespace-nowrap text-lg font-bold" aria-label="Horoscope Hub หน้าแรก">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden className="text-[var(--accent-text)]">
        <path fill="currentColor" d="M12 1.5l2.4 7.6 7.6 2.9-7.6 2.9L12 22.5l-2.4-7.6L2 12l7.6-2.9z" />
      </svg>
      <span>
        Horoscope <span className="text-[var(--accent-text)]">Hub</span>
      </span>
    </Link>
  );
}

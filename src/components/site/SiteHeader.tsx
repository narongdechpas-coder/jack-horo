"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SYSTEMS } from "@/lib/systems/registry";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

/** Active-route test that ignores the trailing slash added by the static export */
const isActive = (pathname: string, href: string) => pathname.replace(/\/$/, "") === href;

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  // Close the mobile menu after navigating
  useEffect(() => {
    if (menu.current?.open) menu.current.close();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-lg focus:bg-[var(--surface)] focus:px-3 focus:py-2">
        ข้ามไปเนื้อหาหลัก
      </a>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5" aria-label="เมนูหลัก">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {SYSTEMS.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                aria-current={isActive(pathname, s.href) ? "page" : undefined}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-[var(--muted)] transition hover:text-[var(--text)] aria-[current=page]:font-semibold aria-[current=page]:text-[var(--accent-text)]"
              >
                {s.navLabel}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={opener}
            type="button"
            onClick={() => menu.current?.showModal()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] lg:hidden"
            aria-label="เปิดเมนู"
            aria-haspopup="dialog"
            data-testid="menu-open"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Native <dialog>: traps focus, closes on Esc, and returns focus to the opener */}
      <dialog
        ref={menu}
        onClick={(e) => {
          if (e.target === menu.current) menu.current.close(); // click on the backdrop
        }}
        onClose={() => opener.current?.focus()}
        className="m-0 ml-auto h-dvh max-h-none w-[min(20rem,85vw)] max-w-none border-l border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--text)] backdrop:bg-black/60"
        aria-label="เมนู"
        data-testid="mobile-menu"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
          <span className="font-semibold">เลือกศาสตร์ดูดวง</span>
          <button
            type="button"
            onClick={() => menu.current?.close()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full"
            aria-label="ปิดเมนู"
            autoFocus
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="p-2">
          <li>
            <Link href="/" className="flex min-h-12 items-center rounded-lg px-3 hover:bg-[var(--surface-2)]">หน้าแรก</Link>
          </li>
          {SYSTEMS.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                aria-current={isActive(pathname, s.href) ? "page" : undefined}
                className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-[var(--surface-2)] aria-[current=page]:text-[var(--accent-text)]"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: `var(--neon-${s.accent})` }} aria-hidden />
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </dialog>
    </header>
  );
}

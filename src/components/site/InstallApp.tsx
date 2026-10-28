"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { closeHelp, install, useInstall } from "./install";

const DISMISS_KEY = "install-dismissed";
const DISMISS_DAYS = 14;
const SHOW_AFTER_MS = 20_000;

function dismissedRecently(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

/** แถว "ติดตั้งแอป" ในเมนูมือถือ แสดงเมื่อมีวิธีติดตั้งให้ */
export function InstallMenuItem() {
  const { mode } = useInstall();
  if (mode === "installed" || mode === "unsupported") return null;
  return (
    <li>
      <button
        type="button"
        onClick={install}
        className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left font-semibold text-[var(--accent-text)] hover:bg-[var(--surface-2)]"
        data-testid="install-menu"
      >
        <PhoneIcon />
        ติดตั้งแอปลงมือถือ
      </button>
    </li>
  );
}

/**
 * แถบชวนติดตั้งด้านล่างจอ (เฉพาะมือถือ) และหน้าต่างอธิบายวิธีติดตั้ง
 * แถบจะขึ้นเมื่อเปิดหน้าที่ 2 หรือหลังอยู่ในเว็บ 20 วินาที เพื่อไม่บังหน้าแรกตอนเพิ่งเข้า
 */
export function InstallApp() {
  const { mode, helpOpen } = useInstall();
  const pathname = usePathname();
  const pages = useRef(0);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const help = useRef<HTMLDialogElement>(null);

  useEffect(() => setDismissed(dismissedRecently()), []);

  useEffect(() => {
    pages.current += 1;
    if (pages.current >= 2) setReady(true);
  }, [pathname]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const d = help.current;
    if (!d) return;
    if (helpOpen && !d.open) d.showModal();
    if (!helpOpen && d.open) d.close();
  }, [helpOpen]);

  function later() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // จำไม่ได้ก็แค่ซ่อนในรอบนี้
    }
    setDismissed(true);
  }

  const canInstall = mode === "prompt" || mode === "ios" || mode === "inapp";
  const showBar = canInstall && ready && !dismissed && !helpOpen;

  return (
    <>
      {showBar && (
        <div
          role="region"
          aria-label="ติดตั้งแอป"
          className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_12px_40px_-12px_rgb(168_85_247/0.6)] lg:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          data-testid="install-bar"
        >
          <span className="ai-orb h-9 w-9 shrink-0 rounded-full" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">ติดตั้งเป็นแอป</p>
            <p className="text-xs text-[var(--muted)]">เปิดดูดวงจากหน้าจอโฮม</p>
          </div>
          <button type="button" onClick={later} className="min-h-11 px-2 text-sm text-[var(--muted)]">
            ไว้ทีหลัง
          </button>
          <button type="button" onClick={install} className="btn-primary min-h-11 rounded-full px-4 text-sm font-semibold text-white">
            ติดตั้ง
          </button>
        </div>
      )}

      <dialog
        ref={help}
        onClose={closeHelp}
        onClick={(e) => {
          if (e.target === help.current) closeHelp();
        }}
        className="m-auto w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--text)] backdrop:bg-black/60"
        aria-label="วิธีติดตั้งแอป"
        data-testid="install-help"
      >
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <span className="ai-orb h-10 w-10 shrink-0 rounded-full" aria-hidden />
            <h2 className="text-lg font-bold">ติดตั้งลงมือถือ</h2>
          </div>
          {mode === "inapp" ? <InAppSteps /> : <IosSteps />}
          <button type="button" onClick={closeHelp} className="min-h-11 w-full rounded-full border border-[var(--border)] text-sm" autoFocus>
            เข้าใจแล้ว
          </button>
        </div>
      </dialog>
    </>
  );
}

function IosSteps() {
  return (
    <ol className="space-y-3 text-sm leading-relaxed">
      <Step n={1}>
        กดปุ่มแชร์ <ShareIcon /> ที่แถบด้านล่าง (หรือด้านบนบน iPad) ของ Safari
      </Step>
      <Step n={2}>
        เลื่อนลงแล้วเลือก <b>&quot;เพิ่มไปยังหน้าจอโฮม&quot;</b>
      </Step>
      <Step n={3}>
        กด <b>&quot;เพิ่ม&quot;</b> ที่มุมขวาบน ไอคอนลูกแก้วจะขึ้นบนหน้าจอโฮมทันที
      </Step>
    </ol>
  );
}

function InAppSteps() {
  const [copied, setCopied] = useState(false);
  const isLine = typeof navigator !== "undefined" && /\bLine\//i.test(navigator.userAgent);
  // LINE เปิดลิงก์ที่มี openExternalBrowser=1 ในเบราว์เซอร์ของเครื่องให้เอง
  const external = (() => {
    if (typeof window === "undefined") return "";
    const u = new URL(window.location.href);
    u.searchParams.set("openExternalBrowser", "1");
    return u.toString();
  })();

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href.replace(/[?&]openExternalBrowser=1/, ""));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <p>ตอนนี้เปิดเว็บอยู่ในแอปแชท ซึ่งติดตั้งแอปไม่ได้ ให้เปิดใน Safari หรือ Chrome ก่อน แล้วค่อยติดตั้ง</p>
      {isLine ? (
        <a href={external} className="btn-primary flex min-h-11 items-center justify-center rounded-full font-semibold text-white">
          เปิดในเบราว์เซอร์
        </a>
      ) : (
        <p className="text-[var(--muted)]">
          กดเมนู <b>⋯</b> ที่มุมจอ แล้วเลือก <b>&quot;เปิดในเบราว์เซอร์&quot;</b>
        </p>
      )}
      <button type="button" onClick={copy} className="min-h-11 w-full rounded-full border border-[var(--border)]">
        {copied ? "คัดลอกลิงก์แล้ว ✓" : "คัดลอกลิงก์ไปเปิดเอง"}
      </button>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-xs font-bold text-[var(--accent-text)]">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-label="ปุ่มแชร์" className="inline-block align-text-bottom text-[var(--neon-blue)]">
      <path d="M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v6M9.5 11.5 12 14l2.5-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

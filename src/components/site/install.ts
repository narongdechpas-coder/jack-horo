"use client";

// สถานะการติดตั้งเว็บเป็นแอป (PWA) ใช้ร่วมกันระหว่างแถบด้านล่างจอและเมนูมือถือ

import { useSyncExternalStore } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * - installed: เปิดจากไอคอนบนหน้าจอโฮมอยู่แล้ว
 * - prompt: Chrome/Edge/Android เปิดหน้าต่างติดตั้งให้ได้
 * - ios: Safari บน iPhone/iPad ต้องกด "เพิ่มไปยังหน้าจอโฮม" เอง
 * - inapp: เบราว์เซอร์ในแอป LINE/Facebook/Instagram ติดตั้งไม่ได้ ต้องเปิดใน Safari/Chrome ก่อน
 * - unsupported: เบราว์เซอร์อื่นที่ยังไม่รองรับ
 */
export type InstallMode = "installed" | "prompt" | "ios" | "inapp" | "unsupported";

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface State {
  mode: InstallMode;
  /** หน้าต่างอธิบายวิธีติดตั้ง (iPhone และเบราว์เซอร์ในแอป) */
  helpOpen: boolean;
}

const SERVER_STATE: State = { mode: "unsupported", helpOpen: false };
let state: State = SERVER_STATE;
let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();
let started = false;

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function detectMode(ua: string, standalone: boolean, touchMac: boolean): InstallMode {
  if (standalone) return "installed";
  if (/\bLine\/|FBAN|FBAV|FB_IAB|Instagram/i.test(ua)) return "inapp";
  if (/iPhone|iPad|iPod/.test(ua) || touchMac) return "ios";
  return "unsupported";
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;

  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  // iPadOS แจ้งตัวเป็น Mac แต่มีจอสัมผัส
  const touchMac = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
  state = { mode: detectMode(navigator.userAgent, standalone, touchMac), helpOpen: false };

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // ใช้ปุ่มของเว็บแทนแถบติดตั้งของเบราว์เซอร์
    deferred = e as InstallPromptEvent;
    if (state.mode !== "installed") set({ mode: "prompt" });
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    set({ mode: "installed", helpOpen: false });
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch(() => {
      // ไม่มี service worker เว็บก็ยังใช้ได้ปกติ แค่ติดตั้งและออฟไลน์ไม่ได้
    });
  }
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useInstall(): State {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
}

/** ปุ่ม "ติดตั้ง": เปิดหน้าต่างของเบราว์เซอร์ถ้าทำได้ ไม่งั้นเปิดวิธีติดตั้ง */
export async function install() {
  if (deferred) {
    const e = deferred;
    deferred = null;
    await e.prompt();
    const { outcome } = await e.userChoice;
    // หน้าต่างติดตั้งใช้ได้ครั้งเดียว ถ้าผู้ใช้ปฏิเสธ เบราว์เซอร์จะส่ง event ใหม่มาเองภายหลัง
    if (outcome === "accepted") set({ mode: "installed" });
    else set({ mode: "unsupported" });
    return;
  }
  set({ helpOpen: true });
}

export const closeHelp = () => set({ helpOpen: false });

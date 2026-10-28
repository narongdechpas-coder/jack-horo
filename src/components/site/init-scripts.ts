// Inline <head> scripts that run before first paint. Kept out of "use client" files so the
// server layout gets the real strings, not client references.

/** Applies a saved theme so it never flashes the other one. */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/** Shows the mobile opening animation (SplashScreen) only on the first page of a visit. */
export const SPLASH_INIT_SCRIPT = `try{if(sessionStorage.getItem("splash"))document.documentElement.dataset.splash="seen";else sessionStorage.setItem("splash","1")}catch(e){}`;

/** สีแถบสถานะของมือถือ ตรงกับ --bg ของแต่ละธีมใน globals.css */
export const BAR_COLOR = { dark: "#050817", light: "#f6f5ff" } as const;

/**
 * สร้าง <meta name="theme-color"> เองนอก React (Next จะเขียนแท็กที่สร้างจาก viewport ทับทุกครั้งที่เปลี่ยนหน้า)
 * ตั้งสีตามธีมที่เลือก ถ้ายังไม่เลือกใช้ธีมของเครื่อง และเปลี่ยนตามเมื่อผู้ใช้เปลี่ยนโหมดของเครื่อง
 * ThemeToggle อัปเดตแท็กเดียวกันนี้ผ่าน id="theme-color"
 */
export const THEME_COLOR_SCRIPT = `try{var d=document,q=matchMedia("(prefers-color-scheme: dark)"),m=d.createElement("meta");m.name="theme-color";m.id="theme-color";d.head.appendChild(m);var s=function(){var t=d.documentElement.dataset.theme||(q.matches?"dark":"light");m.content=t==="dark"?"${BAR_COLOR.dark}":"${BAR_COLOR.light}"};s();q.addEventListener("change",s)}catch(e){}`;

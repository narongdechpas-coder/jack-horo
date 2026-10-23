import { useEffect, useState } from "react";

/** วันที่ตามเครื่องของผู้ใช้ในรูปแบบ YYYY-MM-DD (ใช้กับ <input type="date">) */
export function todayISO(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** วันเกิดอยู่ในอนาคตหรือไม่ (เทียบสตริง YYYY-MM-DD ได้ตรง ๆ) */
export function isFutureDate(iso: string, now: Date = new Date()): boolean {
  return iso > todayISO(now);
}

/**
 * วันนี้ตามเครื่องผู้ใช้ สำหรับตั้ง max ของช่องวันเกิด
 * เว็บเป็น static ถ้าคำนวณตอน build จะค้างเป็นวันที่ build จึงคำนวณหลังเปิดหน้าในเบราว์เซอร์
 */
export function useToday(): string | undefined {
  const [today, setToday] = useState<string>();
  useEffect(() => setToday(todayISO()), []);
  return today;
}

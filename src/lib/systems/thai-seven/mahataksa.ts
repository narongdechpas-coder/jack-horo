// มหาทักษา (ดาวเสวยอายุ) ตามตำราพรหมชาติ
// ดาว 8 องค์ผลัดกันดูแลชีวิตเป็นช่วง ๆ รวมรอบละ 108 ปี เริ่มจากดาววันเกิด แล้วเดินตามวงทักษา
// ช่วงแรกเริ่มตั้งแต่วันเกิด นับอายุเป็นอายุเต็ม (บางตำราใช้อายุย่าง ผลจะเลื่อนไป 1 ปี)
// ไม่ได้คำนวณดาวแทรก (ภุกติ)

import { PLANET_NAMES, TAKSA_ORDER, roleOf, type Planet, type Role } from "../daily/taksa";
import type { SevenResult } from "./calculate";

/** จำนวนปีที่ดาวแต่ละองค์เสวยอายุ (กำลังดาว) รวม 108 */
export const TAKSA_YEARS: Record<Planet, number> = { 1: 6, 2: 15, 3: 8, 4: 17, 7: 10, 5: 19, 8: 12, 6: 21 };

export interface TaksaPeriod {
  planet: Planet;
  name: string;
  /** อายุเต็มตอนเริ่ม และตอนสิ้นสุด (ไม่รวม) */
  startAge: number;
  endAge: number;
  /** ปี พ.ศ. ที่เริ่ม และปีที่สิ้นสุด */
  startYear: number;
  endYear: number;
}

export interface MahaTaksa {
  birth: Planet;
  age: number;
  periods: TaksaPeriod[];
  current: TaksaPeriod;
  next: TaksaPeriod;
  /** ภูมิของดาวที่เสวยอยู่ในทักษาของเจ้าชะตา */
  role: Role;
  nextRole: Role;
  /** เหลืออีกกี่ปีจะเปลี่ยนช่วง */
  yearsLeft: number;
}

/** อายุเต็มเมื่อถึงวันที่ `today` */
export function fullAge(birth: Date, today: Date): number {
  let age = today.getFullYear() - birth.getFullYear();
  const before = today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (before) age--;
  return Math.max(0, age);
}

/**
 * @param birth ดาววันเกิด (1–7 ตามวัน, 8 = พุธกลางคืน)
 * @param birthDate วันเกิดตามปฏิทิน ใช้หาอายุและปี พ.ศ.
 * @param today วันที่ที่ต้องการดู
 */
export function mahaTaksa(birth: Planet, birthDate: Date, today: Date): MahaTaksa {
  const age = fullAge(birthDate, today);
  const cycle = Math.floor(age / 108);
  const start = TAKSA_ORDER.indexOf(birth);
  const birthYearBE = birthDate.getFullYear() + 543;

  // สร้างช่วงของรอบปัจจุบันและรอบถัดไป เพื่อให้หา "ช่วงถัดไป" ได้เสมอ
  const periods: TaksaPeriod[] = [];
  let at = cycle * 108;
  for (let i = 0; i < 16; i++) {
    const planet = TAKSA_ORDER[(start + i) % 8];
    const years = TAKSA_YEARS[planet];
    periods.push({ planet, name: PLANET_NAMES[planet], startAge: at, endAge: at + years, startYear: birthYearBE + at, endYear: birthYearBE + at + years });
    at += years;
  }

  const idx = periods.findIndex((p) => age >= p.startAge && age < p.endAge);
  const current = periods[idx];
  const next = periods[idx + 1];
  return {
    birth,
    age,
    periods: periods.slice(0, 8),
    current,
    next,
    role: roleOf(birth, current.planet),
    nextRole: roleOf(birth, next.planet),
    yearsLeft: current.endAge - age,
  };
}

/** มหาทักษาของดวงเลข 7 ตัว: ดาววันเกิดใช้วันทางโหราศาสตร์ (หลังเลื่อนกรณีเกิดก่อน 06:00) */
export function sevenTaksa(r: SevenResult, today: Date): MahaTaksa {
  const birth = (r.isRahu ? 8 : r.dayNumber) as Planet;
  return mahaTaksa(birth, new Date(r.input.year, r.input.month - 1, r.input.day), today);
}

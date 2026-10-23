// คำนวณดวงโหราศาสตร์สากลด้วย astronomy-engine (MIT): ตำแหน่งดาวบนสุริยวิถีของวันที่ (Tropical)
// เวลาเกิดเป็นเวลามาตรฐานประเทศไทย (UTC+7 ใช้มาตั้งแต่ปี 1920)

import * as Astronomy from "astronomy-engine";
import { JUPITER_TRANSIT, MOON_TRANSIT, SATURN_TRANSIT, type PlanetKey, type Tone } from "./lore";
import { findProvince, DEFAULT_PROVINCE, type Province } from "./provinces";

const BODIES: Record<PlanetKey, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
};

export const PLANET_ORDER: PlanetKey[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"];

export interface Placement {
  /** องศาบนสุริยวิถี 0–360 */
  longitude: number;
  /** ราศี 0 = เมษ … 11 = มีน */
  sign: number;
  /** องศาในราศี 0–29.99 */
  degree: number;
}

export interface ZodiacInput {
  year: number;
  month: number;
  day: number;
  /** "HH:MM" ตามเวลาไทย (ไม่บังคับ) */
  time?: string;
  /** ชื่อจังหวัดเกิด (ไม่ใส่ = กรุงเทพมหานคร) */
  province?: string;
}

export interface ZodiacChart {
  input: ZodiacInput;
  province: Province;
  hasTime: boolean;
  planets: Record<PlanetKey, Placement>;
  /** ลัคนา ต้องรู้เวลาเกิด */
  ascendant: Placement | null;
  /** ไม่รู้เวลาเกิดและวันนั้นดาวย้ายราศี จึงยังสรุปราศีไม่ได้แน่ชัด */
  sunUncertain: boolean;
  moonUncertain: boolean;
}

const norm = (deg: number) => ((deg % 360) + 360) % 360;

export function placement(longitude: number): Placement {
  const l = norm(longitude);
  return { longitude: l, sign: Math.floor(l / 30), degree: l % 30 };
}

/** องศาบนสุริยวิถีของดาว ณ เวลานั้น (ศูนย์กลางโลก, true ecliptic of date) */
export function longitudeOf(planet: PlanetKey, at: Date): number {
  return Astronomy.Ecliptic(Astronomy.GeoVector(BODIES[planet], at, true)).elon;
}

/** ลัคนา: จุดสุริยวิถีที่กำลังขึ้นทางขอบฟ้าตะวันออก */
export function ascendantAt(at: Date, lat: number, lon: number): number {
  const time = Astronomy.MakeTime(at);
  const ramc = (Astronomy.SiderealTime(time) * 15 + lon) * (Math.PI / 180);
  const eps = Astronomy.e_tilt(time).tobl * (Math.PI / 180);
  const phi = lat * (Math.PI / 180);
  const asc = Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)));
  return norm((asc * 180) / Math.PI);
}

function parseTime(time?: string): { h: number; m: number } | null {
  const match = time && /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return h <= 23 && m <= 59 ? { h, m } : null;
}

/** เวลาไทย → เวลาสากล */
const thaiInstant = (y: number, mo: number, d: number, h: number, mi: number) => new Date(Date.UTC(y, mo - 1, d, h - 7, mi));

export function isValidDate(year: number, month: number, day: number): boolean {
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

export function calculateZodiac(input: ZodiacInput): ZodiacChart {
  const { year, month, day } = input;
  if (!isValidDate(year, month, day) || year < 1920 || year > 2100) {
    throw new RangeError("วันเกิดไม่ถูกต้อง (รองรับ ค.ศ. 1920–2100)");
  }
  const province = findProvince(input.province) ?? findProvince(DEFAULT_PROVINCE)!;
  const t = parseTime(input.time);
  // ไม่รู้เวลาเกิดใช้เที่ยงวัน ซึ่งคลาดได้ไม่เกินครึ่งวันในทุกกรณี
  const at = thaiInstant(year, month, day, t?.h ?? 12, t?.m ?? 0);
  const planets = Object.fromEntries(PLANET_ORDER.map((p) => [p, placement(longitudeOf(p, at))])) as Record<PlanetKey, Placement>;

  const signAt = (p: PlanetKey, h: number, m: number) => placement(longitudeOf(p, thaiInstant(year, month, day, h, m))).sign;
  const changes = (p: PlanetKey) => !t && signAt(p, 0, 0) !== signAt(p, 23, 59);

  return {
    input,
    province,
    hasTime: !!t,
    planets,
    ascendant: t ? placement(ascendantAt(at, province.lat, province.lon)) : null,
    sunUncertain: changes("sun"),
    moonUncertain: changes("moon"),
  };
}

/** เรือนนับจากราศีดวงอาทิตย์ (0 = เรือนที่ 1) */
export const solarHouse = (sunSign: number, sign: number) => (sign - sunSign + 12) % 12;

export interface DailyZodiac {
  moonSign: number;
  house: number;
  tone: Tone;
  story: string;
  advice: string;
}

/** ดวงรายวันตามราศีดวงอาทิตย์: ดวงจันทร์วันนี้ผ่านเรือนไหน (ดูตอนเที่ยงวันเวลาไทย) */
export function dailyZodiac(sunSign: number, date: Date): DailyZodiac {
  const moonSign = placement(longitudeOf("moon", thaiInstant(date.getFullYear(), date.getMonth() + 1, date.getDate(), 12, 0))).sign;
  const house = solarHouse(sunSign, moonSign);
  return { moonSign, house, ...MOON_TRANSIT[house] };
}

export interface YearlyZodiac {
  jupiterSign: number;
  jupiterHouse: number;
  jupiter: string;
  saturnSign: number;
  saturnHouse: number;
  saturn: string;
}

/** ดวงช่วงปีตามราศีดวงอาทิตย์: ดาวพฤหัสบดี (โชค) และดาวเสาร์ (บทเรียน) จรผ่านเรือนไหน */
export function yearlyZodiac(sunSign: number, date: Date): YearlyZodiac {
  const at = thaiInstant(date.getFullYear(), date.getMonth() + 1, date.getDate(), 12, 0);
  const jupiterSign = placement(longitudeOf("jupiter", at)).sign;
  const saturnSign = placement(longitudeOf("saturn", at)).sign;
  const jupiterHouse = solarHouse(sunSign, jupiterSign);
  const saturnHouse = solarHouse(sunSign, saturnSign);
  return {
    jupiterSign,
    jupiterHouse,
    jupiter: JUPITER_TRANSIT[jupiterHouse],
    saturnSign,
    saturnHouse,
    saturn: SATURN_TRANSIT[saturnHouse],
  };
}

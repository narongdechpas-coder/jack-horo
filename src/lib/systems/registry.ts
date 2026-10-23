export type Origin = "thai" | "western" | "chinese";

/** สีประจำศาสตร์ (ดู --cat-* และ --neon-* ใน globals.css) */
export type Accent = "blue" | "magenta" | "purple" | "cyan" | "gold" | "orange";

export interface SystemInfo {
  id: string;
  name: string;
  /** ชื่อสั้นสำหรับเมนู */
  navLabel: string;
  origin: Origin;
  description: string;
  href: string;
  accent: Accent;
  /** ชื่อภาพใน src/lib/art-manifest.json */
  art: string;
  /** คำอธิบายภาพสำหรับผู้ใช้โปรแกรมอ่านหน้าจอ */
  artAlt: string;
}

export const ORIGIN_LABELS: Record<Origin, string> = {
  thai: "ศาสตร์ไทย",
  western: "ศาสตร์ตะวันตก",
  chinese: "ศาสตร์จีน",
};

// เพิ่มศาสตร์ใหม่: สร้างโฟลเดอร์ใน lib/systems/<id> และหน้าใน app/<id> แล้วลงทะเบียนที่นี่
export const SYSTEMS: SystemInfo[] = [
  {
    id: "thai-seven",
    name: "เลข 7 ตัว",
    navLabel: "เลข 7 ตัว",
    origin: "thai",
    description: "ทักษาเลข 7 ตัว 4 ฐาน คำนวณจากวัน เดือนจันทรคติ และปีนักษัตรเกิด",
    href: "/thai-seven",
    accent: "blue",
    art: "cat-thai-seven",
    artAlt: "เลข 7 เรืองแสงล้อมด้วยดวงดาวหมายเลข 1 ถึง 7",
  },
  {
    id: "zodiac",
    name: "12 ราศี (โหราศาสตร์สากล)",
    navLabel: "12 ราศี",
    origin: "western",
    description: "ราศีดวงอาทิตย์ ดวงจันทร์ และลัคนาจากวันเวลาเกิด พร้อมดวงวันนี้และดวงช่วงปีตามดาวจร",
    href: "/zodiac",
    accent: "orange",
    // TODO: เปลี่ยนเป็น "cat-zodiac" เมื่อได้ภาพ IMG-08
    art: "hero-wide",
    artAlt: "วงล้อจักรราศีเรืองแสงกลางอวกาศ",
  },
  {
    id: "playing-cards",
    name: "ไพ่ป๊อก",
    navLabel: "ไพ่ป๊อก",
    origin: "western",
    description: "เปิดไพ่ 52 ใบ ดูดวงประจำวัน หรืออดีต ปัจจุบัน อนาคต",
    href: "/playing-cards",
    accent: "magenta",
    art: "cat-playing-cards",
    artAlt: "ไพ่โพดำ หัวใจ และดอกจิก ลอยอยู่กลางอวกาศ",
  },
  {
    id: "tarot",
    name: "ไพ่ยิปซี (Tarot)",
    navLabel: "ไพ่ยิปซี",
    origin: "western",
    description: "สำรับ Rider-Waite 78 ใบ มีไพ่ประจำวัน ความรัก และ Celtic Cross",
    href: "/tarot",
    accent: "purple",
    art: "cat-tarot",
    artAlt: "ไพ่ยิปซีห้าใบรูปดวงอาทิตย์ ดวงจันทร์ และดวงดาว",
  },
  {
    id: "oraculum",
    name: "ตำราพยากรณ์นโปเลียน",
    navLabel: "นโปเลียน",
    origin: "western",
    description: "ตั้งคำถาม 1 ใน 32 ข้อ ขีดเส้น 5 บรรทัดตามใจ แล้วรับคำพยากรณ์จากสัญลักษณ์ 32 แบบ",
    href: "/oraculum",
    accent: "cyan",
    art: "cat-oraculum",
    artAlt: "ตำราโบราณเปิดอยู่ มีจุดดาวเรืองแสงห้าแถวลอยขึ้นจากหน้ากระดาษ",
  },
  {
    id: "bazi",
    name: "ปาจื้อ (Bazi)",
    navLabel: "ปาจื้อ",
    origin: "chinese",
    description: "สี่เสาดวงชะตาจากปีเดือนวันเวลาเกิด ธาตุทั้งห้า และวัยจรทุก 10 ปี",
    href: "/bazi",
    accent: "gold",
    art: "cat-bazi",
    artAlt: "เสาสี่ต้นใต้วงแปดทิศและสัญลักษณ์ธาตุทั้งห้า",
  },
];

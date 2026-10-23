export type Origin = "thai" | "western" | "chinese";

/** สีประจำศาสตร์ (ดู --cat-* และ --neon-* ใน globals.css) */
export type Accent = "blue" | "magenta" | "purple" | "cyan" | "gold" | "orange" | "jade" | "teal";

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
    artAlt: "ลายเส้นทองรูปเลขโรมัน VII ในวงโคจรของดาว 7 ดวง บนพื้นน้ำเงินเข้ม",
  },
  {
    id: "zodiac",
    name: "12 ราศี (โหราศาสตร์สากล)",
    navLabel: "12 ราศี",
    origin: "western",
    description: "ราศีดวงอาทิตย์ ดวงจันทร์ และลัคนาจากวันเวลาเกิด พร้อมดวงวันนี้และดวงช่วงปีตามดาวจร",
    href: "/zodiac",
    accent: "orange",
    art: "cat-zodiac",
    artAlt: "ลายเส้นทองรูปวงล้อจักรราศี 12 ช่อง มีดวงอาทิตย์อยู่ตรงกลาง บนพื้นน้ำเงินเข้ม",
  },
  {
    id: "numerology",
    name: "เลขศาสตร์ (Numerology)",
    navLabel: "เลขศาสตร์",
    origin: "western",
    description: "เลขเส้นทางชีวิตจากวันเกิด เลขจากชื่อทั้งภาษาไทยและอังกฤษ และเลขปีส่วนตัวของปีนี้และปีหน้า",
    href: "/numerology",
    accent: "teal",
    art: "cat-numerology",
    artAlt: "ลายเส้นทองรูปเกลียวทองคำล้อมด้วยตัวเลข 1 ถึง 9 บนพื้นน้ำเงินเข้ม",
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
    artAlt: "ลายเส้นทองรูปไพ่ 3 ใบ โพดำ หัวใจ และดอกจิก บนพื้นน้ำเงินเข้ม",
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
    artAlt: "ลายเส้นทองรูปไพ่ยิปซี 3 ใบ ดวงจันทร์ ดวงอาทิตย์ และดวงดาว บนพื้นน้ำเงินเข้ม",
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
    artAlt: "ลายเส้นทองรูปตำราเปิด มีจุดดาวห้าแถวลอยขึ้นใต้ช่อมะกอก บนพื้นน้ำเงินเข้ม",
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
    artAlt: "ลายเส้นทองรูปเสาสี่ต้นใต้หยินหยางในกรอบแปดทิศ บนพื้นน้ำเงินเข้ม",
  },
  {
    id: "iching",
    name: "อี้จิง (I Ching)",
    navLabel: "อี้จิง",
    origin: "chinese",
    description: "ตั้งคำถาม โยนเหรียญ 6 ครั้ง รับคำตอบจาก 1 ใน 64 ฉากของคัมภีร์แห่งความเปลี่ยนแปลง",
    href: "/iching",
    accent: "jade",
    art: "cat-iching",
    artAlt: "ลายเส้นทองรูปเส้นหกเส้นของอี้จิงเหนือเหรียญจีนโบราณสามเหรียญ บนพื้นน้ำเงินเข้ม",
  },
];

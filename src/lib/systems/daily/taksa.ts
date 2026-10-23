// ดวงวันนี้ตามวันเกิด ใช้หลักทักษาปกรณ์
// ดาวทั้ง 8 เรียงตามวงทักษา เริ่มจากดาววันเกิดเป็น "บริวาร" แล้วนับต่อไปเป็น อายุ เดช ศรี มูละ อุตสาหะ มนตรี กาลกิณี
// ดาวของวันนี้ตกอยู่ภูมิไหนในทักษาของผู้ใช้ ก็ใช้ภูมินั้นอ่านความหมายของวัน

/** เลขดาว: 1 อาทิตย์ … 7 เสาร์ และ 8 ราหู (คนเกิดวันพุธกลางคืน) */
export type Planet = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** วงทักษา: อาทิตย์ จันทร์ อังคาร พุธ เสาร์ พฤหัสบดี ราหู ศุกร์ */
export const TAKSA_ORDER: Planet[] = [1, 2, 3, 4, 7, 5, 8, 6];

export const ROLES = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"] as const;
export type Role = (typeof ROLES)[number];

export const BIRTH_DAYS: { planet: Planet; label: string }[] = [
  { planet: 1, label: "อาทิตย์" },
  { planet: 2, label: "จันทร์" },
  { planet: 3, label: "อังคาร" },
  { planet: 4, label: "พุธ (กลางวัน)" },
  { planet: 8, label: "พุธ (กลางคืน)" },
  { planet: 5, label: "พฤหัสบดี" },
  { planet: 6, label: "ศุกร์" },
  { planet: 7, label: "เสาร์" },
];

export const PLANET_NAMES: Record<Planet, string> = {
  1: "อาทิตย์", 2: "จันทร์", 3: "อังคาร", 4: "พุธ", 5: "พฤหัสบดี", 6: "ศุกร์", 7: "เสาร์", 8: "ราหู",
};

/** สีประจำดาวตามความเชื่อไทย */
export const PLANET_COLORS: Record<Planet, string> = {
  1: "แดง", 2: "เหลือง ครีม", 3: "ชมพู", 4: "เขียว", 5: "ส้ม แสด", 6: "ฟ้า น้ำเงิน", 7: "ม่วง", 8: "เทา ดำ",
};

export type Tone = "good" | "neutral" | "caution";

interface RoleText {
  tone: Tone;
  title: string;
  story: string;
  advice: string;
}

const ROLE_TEXT: Record<Role, RoleText> = {
  บริวาร: {
    tone: "neutral",
    title: "วันของคนรอบตัว",
    story: "วันนี้ดาวประจำวันตรงกับดาววันเกิดของคุณ เรื่องเด่นคือคนใกล้ตัว ทั้งครอบครัว เพื่อน และทีมงาน คุณจะได้แรงหนุนจากคนรอบข้างมากกว่าปกติ",
    advice: "ทำงานเป็นทีม ขอความช่วยเหลือได้ไม่ต้องเกรงใจ และหาเวลาดูแลคนใกล้ชิดสักหน่อย",
  },
  อายุ: {
    tone: "neutral",
    title: "วันดูแลตัวเอง",
    story: "วันนี้เป็นภูมิอายุ เรื่องสุขภาพและความเป็นอยู่จะเด่นขึ้นมา ร่างกายและจิตใจต้องการการพักผ่อนและการเติมพลัง",
    advice: "นอนให้พอ กินอาหารดี ๆ และอย่าหักโหมงานจนเกินตัว",
  },
  เดช: {
    tone: "good",
    title: "วันแห่งอำนาจและความกล้า",
    story: "วันนี้เป็นภูมิเดช คุณจะมีพลังและความน่าเชื่อถือสูง คำพูดมีน้ำหนัก เหมาะกับการเจรจา ตัดสินใจ หรือแสดงความเป็นผู้นำ",
    advice: "กล้าเสนอไอเดียหรือคุยเรื่องที่ค้างไว้ แต่ใช้ความมั่นใจอย่างนุ่มนวล",
  },
  ศรี: {
    tone: "good",
    title: "วันสิริมงคล",
    story: "วันนี้เป็นภูมิศรี ถือเป็นวันดีที่สุดของคุณ มีโชค มีเสน่ห์ เรื่องเงินและความรักมักเป็นไปในทางที่ดี",
    advice: "เหมาะกับการเริ่มต้นสิ่งใหม่ เซ็นสัญญา หรือทำเรื่องสำคัญที่รอจังหวะอยู่",
  },
  มูละ: {
    tone: "neutral",
    title: "วันวางรากฐาน",
    story: "วันนี้เป็นภูมิมูละ เรื่องทรัพย์สิน บ้าน และฐานะความเป็นอยู่จะเด่น เป็นวันที่เหมาะกับการสร้างความมั่นคงระยะยาว",
    advice: "วางแผนการเงิน จัดการเอกสาร หรือดูแลบ้านและทรัพย์สิน",
  },
  อุตสาหะ: {
    tone: "neutral",
    title: "วันแห่งความขยัน",
    story: "วันนี้เป็นภูมิอุตสาหะ งานอาจเยอะและต้องออกแรงมากกว่าปกติ แต่ความพยายามวันนี้จะได้ผลตอบแทนคุ้มค่า",
    advice: "เคลียร์งานที่ค้างทีละอย่าง แล้วให้รางวัลตัวเองเมื่อทำเสร็จ",
  },
  มนตรี: {
    tone: "good",
    title: "วันมีผู้ใหญ่อุปถัมภ์",
    story: "วันนี้เป็นภูมิมนตรี จะมีผู้ใหญ่หรือคนที่มีประสบการณ์คอยช่วยเหลือและให้คำแนะนำดี ๆ การติดต่อขอความช่วยเหลือมักสำเร็จ",
    advice: "ปรึกษาหัวหน้าหรือผู้ใหญ่ที่ไว้ใจ และรับฟังคำแนะนำอย่างเปิดใจ",
  },
  กาลกิณี: {
    tone: "caution",
    title: "วันควรระวัง",
    story: "วันนี้เป็นภูมิกาลกิณี อาจเจออุปสรรคเล็ก ๆ หรือเรื่องไม่คาดคิด อารมณ์อาจหงุดหงิดง่ายกว่าปกติ",
    advice: "ยังไม่ควรเริ่มเรื่องใหญ่ ตรวจทานงานให้รอบคอบ และใจเย็นกับคนรอบตัว",
  },
};

export const TONE_LABEL: Record<Tone, string> = { good: "วันดี", neutral: "วันกลาง ๆ", caution: "วันควรระวัง" };

/** ภูมิของดาว `target` ในทักษาของคนที่เกิดดาว `birth` */
export function roleOf(birth: Planet, target: Planet): Role {
  const b = TAKSA_ORDER.indexOf(birth);
  const t = TAKSA_ORDER.indexOf(target);
  return ROLES[(t - b + 8) % 8];
}

/** ดาวที่อยู่ในภูมิ `role` ของคนที่เกิดดาว `birth` */
export function planetAt(birth: Planet, role: Role): Planet {
  return TAKSA_ORDER[(TAKSA_ORDER.indexOf(birth) + ROLES.indexOf(role)) % 8];
}

/** ดาวประจำวันของวันที่ (อาทิตย์ = 1 … เสาร์ = 7) */
export function dayPlanet(date: Date): Planet {
  return (date.getDay() + 1) as Planet;
}

export interface DailyTaksa {
  birth: Planet;
  today: Planet;
  role: Role;
  tone: Tone;
  toneLabel: string;
  title: string;
  story: string;
  advice: string;
  /** สีเสริมดวง (สีของดาวศรีในทักษาของผู้ใช้) */
  luckyColor: string;
  /** สีที่ควรเลี่ยง (สีของดาวกาลกิณี) */
  avoidColor: string;
}

export function dailyTaksa(birth: Planet, date: Date): DailyTaksa {
  const today = dayPlanet(date);
  const role = roleOf(birth, today);
  const t = ROLE_TEXT[role];
  return {
    birth,
    today,
    role,
    tone: t.tone,
    toneLabel: TONE_LABEL[t.tone],
    title: t.title,
    story: t.story,
    advice: t.advice,
    luckyColor: PLANET_COLORS[planetAt(birth, "ศรี")],
    avoidColor: PLANET_COLORS[planetAt(birth, "กาลกิณี")],
  };
}

/** วันที่แบบไทย เช่น "วันศุกร์ที่ 23 ตุลาคม 2569" */
export function thaiDate(date: Date): string {
  const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const day = PLANET_NAMES[dayPlanet(date)];
  return `วัน${day}ที่ ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
}

/** seed ของไพ่ประจำวัน: ทุกคนได้ไพ่ใบเดียวกันในวันเดียวกัน */
export function dailySeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

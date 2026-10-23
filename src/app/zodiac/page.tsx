import { Suspense } from "react";
import { SystemHero } from "@/components/site/SystemHero";
import { ZodiacClient } from "./ZodiacClient";

export const metadata = { title: "12 ราศี | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <SystemHero id="zodiac">
        โหราศาสตร์สากลที่คนทั่วโลกรู้จัก ใส่วันเกิดเพื่อดูราศีดวงอาทิตย์และดวงจันทร์ ใส่เวลาและจังหวัดเกิดเพิ่มเพื่อดูลัคนา
        พร้อมดวงวันนี้และดวงช่วงปีจากตำแหน่งดาวจริงบนท้องฟ้า
      </SystemHero>
      <Suspense>
        <ZodiacClient />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { SystemHero } from "@/components/site/SystemHero";
import { BaziClient } from "./BaziClient";

export const metadata = { title: "ปาจื้อ (Bazi) | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <SystemHero id="bazi">
        สี่เสาดวงชะตาจีน วางดวงจากปี เดือน วัน และชั่วโมงเกิด ดูธาตุประจำตัว สมดุลธาตุทั้งห้า ธาตุที่ส่งเสริม วัยจรทุก 10 ปี และดวงปีนี้ ใส่เวลาเกิดตามนาฬิกาไทย ถ้าไม่รู้เวลาจะไม่มีเสาชั่วโมง ส่วนเพศใช้คำนวณทิศทางของวัยจร
      </SystemHero>
      <Suspense>
        <BaziClient />
      </Suspense>
    </div>
  );
}

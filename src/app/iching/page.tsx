import { Suspense } from "react";
import { SystemHero } from "@/components/site/SystemHero";
import { IChingClient } from "./IChingClient";

export const metadata = { title: "อี้จิง | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <SystemHero id="iching">
        คัมภีร์แห่งความเปลี่ยนแปลงของจีนที่มีอายุกว่าสามพันปี ตั้งคำถามที่ค้างใจ แล้วโยนเหรียญ 3 เหรียญ 6 ครั้ง
        จะได้ 1 ใน 64 ฉากที่บอกสถานการณ์ตอนนี้ และเส้นที่กำลังเปลี่ยนจะชี้ว่าเรื่องกำลังไปทางไหน
      </SystemHero>
      <Suspense>
        <IChingClient />
      </Suspense>
    </div>
  );
}

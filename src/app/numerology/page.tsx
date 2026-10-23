import { Suspense } from "react";
import { SystemHero } from "@/components/site/SystemHero";
import { NumerologyClient } from "./NumerologyClient";

export const metadata = { title: "เลขศาสตร์ | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <SystemHero id="numerology">
        เลขศาสตร์แบบพีทาโกรัสที่ใช้กันทั่วโลก ใส่วันเกิดเพื่อดูเลขเส้นทางชีวิต เลขวันเกิด และเลขปีส่วนตัว
        ถ้าใส่ชื่อ-นามสกุลภาษาอังกฤษด้วย จะได้เลขชะตา เลขจิตวิญญาณ และเลขบุคลิกจากชื่อเพิ่ม
      </SystemHero>
      <Suspense>
        <NumerologyClient />
      </Suspense>
    </div>
  );
}

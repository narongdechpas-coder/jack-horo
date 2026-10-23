import { Suspense } from "react";
import { SystemHero, systemStyle } from "@/components/site/SystemHero";
import { ThaiSevenClient } from "./ThaiSevenClient";

export const metadata = { title: "เลข 7 ตัว | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8" style={systemStyle("thai-seven")}>
      <SystemHero id="thai-seven">
        ใส่วันเกิดเพื่อวางดวงเลข 7 ตัว 4 ฐาน ระบบจะแปลงเป็นวันทางจันทรคติไทยให้เอง ถ้ารู้เวลาเกิดให้ใส่ด้วย เพราะถ้าเกิดก่อน 06:00 จะนับเป็นวันก่อนหน้า และถ้าเกิดวันพุธหลัง 18:00 จะนับเป็นพุธกลางคืน (ราหู)
      </SystemHero>
      <Suspense>
        <ThaiSevenClient />
      </Suspense>
    </div>
  );
}

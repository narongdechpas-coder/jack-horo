import { Suspense } from "react";
import { SystemHero, systemStyle } from "@/components/site/SystemHero";
import { TarotClient } from "./TarotClient";

export const metadata = { title: "ไพ่ยิปซี | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8" style={systemStyle("tarot")}>
      <SystemHero id="tarot">
        สำรับ Rider-Waite 78 ใบ ทำสมาธิถึงเรื่องที่อยากรู้ กดสับไพ่ แล้วเลือกไพ่ที่คว่ำอยู่ด้วยตัวเอง ไพ่กลับหัวจะมีความหมายต่างจากไพ่ตั้ง
      </SystemHero>
      <Suspense>
        <TarotClient />
      </Suspense>
    </div>
  );
}

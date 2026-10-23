import { Suspense } from "react";
import { SystemHero } from "@/components/site/SystemHero";
import { SUITS } from "@/lib/systems/playing-cards/deck";
import { PlayingCardsClient } from "./PlayingCardsClient";

export const metadata = { title: "ไพ่ป๊อก | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <SystemHero id="playing-cards">
        ตั้งจิตถึงเรื่องที่อยากรู้ กดสับไพ่ แล้วเลือกไพ่ด้วยตัวเอง ไพ่แต่ละดอกมีความหมายต่างกัน:{" "}
        {Object.values(SUITS).map((s) => `${s.symbol} ${s.theme}`).join(" · ")}
      </SystemHero>
      <Suspense>
        <PlayingCardsClient />
      </Suspense>
    </div>
  );
}

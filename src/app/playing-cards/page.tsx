import { Suspense } from "react";
import { PlayingCardsClient } from "./PlayingCardsClient";

export const metadata = { title: "ไพ่ป๊อก | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Suspense>
        <PlayingCardsClient />
      </Suspense>
    </div>
  );
}

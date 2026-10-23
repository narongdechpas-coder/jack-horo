import { Suspense } from "react";
import { TarotClient } from "./TarotClient";

export const metadata = { title: "ไพ่ยิปซี | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Suspense>
        <TarotClient />
      </Suspense>
    </div>
  );
}

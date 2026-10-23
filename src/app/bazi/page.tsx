import { Suspense } from "react";
import { BaziClient } from "./BaziClient";

export const metadata = { title: "ปาจื้อ (Bazi) | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Suspense>
        <BaziClient />
      </Suspense>
    </div>
  );
}

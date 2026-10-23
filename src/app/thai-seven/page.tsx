import { Suspense } from "react";
import { ThaiSevenClient } from "./ThaiSevenClient";

export const metadata = { title: "เลข 7 ตัว | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Suspense>
        <ThaiSevenClient />
      </Suspense>
    </div>
  );
}

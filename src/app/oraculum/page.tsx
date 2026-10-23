import { Suspense } from "react";
import { OraculumClient } from "./OraculumClient";

export const metadata = { title: "ตำราพยากรณ์นโปเลียน | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Suspense>
        <OraculumClient />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { OraculumClient } from "./OraculumClient";

export const metadata = { title: "ตำราพยากรณ์นโปเลียน | Horoscope Hub" };

export default function Page() {
  return (
    <Suspense>
      <OraculumClient />
    </Suspense>
  );
}

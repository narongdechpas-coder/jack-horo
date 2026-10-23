import { Suspense } from "react";
import { SystemHero, systemStyle } from "@/components/site/SystemHero";
import { OraculumClient } from "./OraculumClient";

export const metadata = { title: "ตำราพยากรณ์นโปเลียน | Horoscope Hub" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8" style={systemStyle("oraculum")}>
      <SystemHero id="oraculum">
        ตำราทำนายโบราณที่เล่ากันว่านโปเลียนใช้ปรึกษาก่อนตัดสินใจเรื่องสำคัญ เลือกคำถามที่ตรงใจ แล้วขีดเส้น 5 แถวตามใจโดยไม่ต้องนับ
        จำนวนขีดคี่หรือคู่จะชี้ไปที่สัญลักษณ์ 1 ใน 32 แบบ
      </SystemHero>
      <Suspense>
        <OraculumClient />
      </Suspense>
    </div>
  );
}

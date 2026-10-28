import type { MetadataRoute } from "next";

// Home-screen install info: Android/Chrome uses these icons (built by scripts/prepare-icons.mjs)
export const dynamic = "force-static";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${BASE_PATH}/`,
    name: "Horoscope Hub",
    short_name: "Horoscope Hub",
    description: "รวมศาสตร์ดูดวงจากไทย ตะวันตก และจีน ไว้ในที่เดียว",
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    lang: "th",
    categories: ["lifestyle", "entertainment"],
    background_color: "#050817",
    theme_color: "#050817",
    icons: [192, 512].flatMap((size) =>
      (["any", "maskable"] as const).map((purpose) => ({
        src: `${BASE_PATH}/icon-${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose,
      })),
    ),
  };
}

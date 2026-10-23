import type { Metadata, Viewport } from "next";
import "@fontsource/noto-sans-thai/400.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/700.css";
import "./globals.css";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { THEME_INIT_SCRIPT } from "@/components/site/ThemeToggle";

export const metadata: Metadata = {
  title: "Horoscope Hub",
  description: "รวมศาสตร์ดูดวงจากไทย ตะวันตก และจีน ไว้ในที่เดียว: เลข 7 ตัว ไพ่ป๊อก ไพ่ยิปซี ตำราพยากรณ์นโปเลียน และปาจื้อ",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050817" },
    { media: "(prefers-color-scheme: light)", color: "#f6f5ff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set before paint by THEME_INIT_SCRIPT, so React must not complain about it
    <html lang="th" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

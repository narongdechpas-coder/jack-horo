import { artSrcSet } from "@/components/site/Art";
import { ArtImage } from "@/components/site/Art";

/** Hero: artwork is always dark, so its text stays light in both themes */
export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <picture>
        {/* Portrait artwork on phones keeps the zodiac wheel clear of the headline */}
        <source media="(max-width: 767px)" srcSet={artSrcSet("hero-tall")} sizes="100vw" />
        <ArtImage
          name="hero-wide"
          alt=""
          sizes="100vw"
          priority
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center] md:object-right"
        />
      </picture>
      {/* Scrim: darkens the text side only, so the artwork stays vivid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(5_8_23/0.95)_0%,rgb(5_8_23/0.55)_45%,transparent_75%)] md:bg-[linear-gradient(to_right,rgb(5_8_23/0.9)_0%,rgb(5_8_23/0.55)_45%,transparent_70%)]"
      />
      <div className="mx-auto flex min-h-[38rem] max-w-6xl flex-col justify-end px-4 pb-10 pt-40 md:min-h-[34rem] md:justify-center md:py-20">
        <div className="max-w-xl space-y-4 text-white">
          <p className="text-sm font-semibold tracking-[0.3em] text-[#c4b5fd]">HOROSCOPE HUB</p>
          <h1 id="hero-title" className="text-4xl font-bold leading-tight sm:text-5xl">
            จักรวาลมีคำตอบ{" "}
            <span className="bg-gradient-to-r from-[#c084fc] to-[#f472b6] bg-clip-text text-transparent">
              แล้วคุณพร้อมค้นหาหรือยัง?
            </span>
          </h1>
          <p className="text-lg text-[#d6dcf0]">
            รวมศาสตร์ดูดวงจากไทย ตะวันตก และจีน ไว้ในที่เดียว ค้นหาคำตอบเรื่องงาน การเงิน ความรัก และอนาคตของคุณ
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a href="#daily" className="btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 font-semibold">
              ดูดวงวันนี้ <span aria-hidden>→</span>
            </a>
            <a
              href="#categories"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 bg-white/5 px-7 font-semibold text-white backdrop-blur transition hover:border-white hover:bg-white/10"
            >
              เลือกศาสตร์ที่สนใจ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

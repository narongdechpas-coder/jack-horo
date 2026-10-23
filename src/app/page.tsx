import { CategoryExplorer } from "@/components/home/CategoryExplorer";
import { DailyHoroscopePanel } from "@/components/home/DailyHoroscopePanel";
import { FeaturedTarotCard } from "@/components/home/FeaturedTarotCard";
import { HeroSection } from "@/components/home/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <CategoryExplorer />
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <DailyHoroscopePanel />
          <FeaturedTarotCard />
        </div>
      </div>
    </>
  );
}

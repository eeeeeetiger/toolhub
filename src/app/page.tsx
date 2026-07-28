import { HeroSection } from '@/components/home/hero-section';
import { ToolGrid } from '@/components/home/tool-grid';
import {
  RecentSection,
  PopularSection,
  DiscoverSection,
} from '@/components/home/discovery-sections';
import { IntroSection } from '@/components/home/intro-section';
import { FaqSection } from '@/components/home/faq-section';
import { AdSlot } from '@/components/layout/ad-slot';

export default function Home() {
  return (
    <>
      <HeroSection />
      <RecentSection />
      <PopularSection />
      <AdSlot slot="infeed" format="rectangle" className="py-4" />
      <ToolGrid />
      <DiscoverSection />
      <IntroSection />
      <FaqSection />
    </>
  );
}

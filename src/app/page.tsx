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
import { SITE_NAME, SITE_URL } from '@/lib/site';

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
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

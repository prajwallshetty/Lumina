import { Hero } from "@/components/website/home/hero";
import { ClientLogos } from "@/components/website/home/client-logos";
import { FeaturedProject } from "@/components/website/home/featured-project";
import { PortfolioGrid } from "@/components/website/home/portfolio-grid";
import { StatsSection } from "@/components/website/home/stats-section";
import { PhilosophySection } from "@/components/website/home/philosophy-section";
import { TestimonialsSection } from "@/components/website/home/testimonials-section";
import { BottomCta } from "@/components/website/home/bottom-cta";
import { getHomepageContent } from "@/services/homepage.service";

export default async function HomePage() {
  const home = await getHomepageContent();

  return (
    <>
      <Hero
        eyebrow={home.heroEyebrow}
        title={home.heroTitle}
        subtitle={home.heroSubtitle}
        mediaUrl={home.heroMediaUrl}
        primaryCta={
          home.heroPrimaryCtaLabel && home.heroPrimaryCtaHref
            ? { label: home.heroPrimaryCtaLabel, href: home.heroPrimaryCtaHref }
            : null
        }
        secondaryCta={
          home.heroSecondaryCtaLabel && home.heroSecondaryCtaHref
            ? { label: home.heroSecondaryCtaLabel, href: home.heroSecondaryCtaHref }
            : null
        }
      />

      <ClientLogos />

      <FeaturedProject />

      <PortfolioGrid />

      {home.showStats && <StatsSection />}

      <PhilosophySection />

      <TestimonialsSection />

      <BottomCta />
    </>
  );
}

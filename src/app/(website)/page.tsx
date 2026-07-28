import { Hero } from "@/components/website/home/hero";
import { PortfolioGrid } from "@/components/website/home/portfolio-grid";
import { BeforeAfterSection } from "@/components/website/home/before-after-section";
import { PhilosophySection } from "@/components/website/home/philosophy-section";
import { TestimonialsSection } from "@/components/website/home/testimonials-section";
import { BottomCta } from "@/components/website/home/bottom-cta";
import { getHomepageContent } from "@/services/homepage.service";

export default async function HomePage() {
  // Gracefully handle missing DATABASE_URL — all sections have built-in defaults.
  const home = await getHomepageContent().catch(() => null);

  return (
    <>
      <Hero
        eyebrow={home?.heroEyebrow}
        title={home?.heroTitle}
        subtitle={home?.heroSubtitle}
        mediaUrl={home?.heroMediaUrl || "/luminahero.mp4"}
        primaryCta={
          home?.heroPrimaryCtaLabel && home?.heroPrimaryCtaHref
            ? { label: home.heroPrimaryCtaLabel, href: home.heroPrimaryCtaHref }
            : null
        }
        secondaryCta={
          home?.heroSecondaryCtaLabel && home?.heroSecondaryCtaHref
            ? { label: home.heroSecondaryCtaLabel, href: home.heroSecondaryCtaHref }
            : null
        }
      />

      <PortfolioGrid />

      <BeforeAfterSection />

      <PhilosophySection />

      <TestimonialsSection />

      <BottomCta />
    </>
  );
}

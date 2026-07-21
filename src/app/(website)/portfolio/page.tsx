import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/shared/section";
import { PortfolioFilter } from "@/components/website/portfolio-filter";
import { getPublishedProjects, getProjectCategories } from "@/services/portfolio.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Portfolio",
  description: "Selected residential and commercial interior design projects.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const [projects, categories] = await Promise.all([
    getPublishedProjects(),
    getProjectCategories(),
  ]);

  return (
    <Section className="pt-16 md:pt-24">
      <SectionHeading
        eyebrow="Portfolio"
        title="Spaces we've shaped"
        description="Filter by category to explore our work across homes, workplaces and hospitality."
      />
      <div className="mt-12">
        <PortfolioFilter projects={projects} categories={categories} />
      </div>
    </Section>
  );
}

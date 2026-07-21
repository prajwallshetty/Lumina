import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { BeforeAfterSlider } from "@/components/website/before-after-slider";
import { getBeforeAfters } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Before & After",
  description: "See the transformation — interactive before and after comparisons.",
  path: "/before-after",
});

export default async function BeforeAfterPage() {
  const items = await getBeforeAfters();

  return (
    <Section className="pt-16 md:pt-24">
      <SectionHeading
        eyebrow="Transformations"
        title="Before &amp; after"
        description="Drag the handle to reveal the transformation on each project."
      />
      <div className="mt-12 space-y-16">
        {items.length > 0 ? (
          items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <div className="space-y-4">
                <BeforeAfterSlider beforeUrl={item.beforeUrl} afterUrl={item.afterUrl} title={item.title} />
                <div>
                  <h3 className="font-heading text-xl font-medium">{item.title}</h3>
                  {item.caption && <p className="mt-1 text-muted-foreground">{item.caption}</p>}
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <p className="text-muted-foreground">Before &amp; after comparisons will appear here once added in the CMS.</p>
        )}
      </div>
    </Section>
  );
}

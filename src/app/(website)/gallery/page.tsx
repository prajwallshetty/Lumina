import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { MediaContainer } from "@/components/shared/media-container";
import { getGalleryItems } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description: "A visual gallery of our interior design work.",
  path: "/gallery",
});

// Masonry-like varied aspect ratios for visual rhythm.
const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]"];

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <Section className="pt-16 md:pt-24">
      <SectionHeading eyebrow="Gallery" title="Moments of design" />
      <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.length > 0 ? (
          items.map((item, i) => (
            <Reveal key={item.id} className="break-inside-avoid" delay={(i % 6) * 0.03}>
              <MediaContainer
                src={item.url ?? null}
                alt={item.title}
                label={item.category ?? "Gallery"}
                aspect={ASPECTS[i % ASPECTS.length]}
              />
            </Reveal>
          ))
        ) : (
          <p className="text-muted-foreground">Gallery images will appear here once uploaded in the CMS.</p>
        )}
      </div>
    </Section>
  );
}

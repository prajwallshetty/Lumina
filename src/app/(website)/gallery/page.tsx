import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/shared/section";
import { GalleryFilter } from "@/components/website/gallery-filter";
import { getGalleryItems } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description: "A visual gallery of our interior design work.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <Section className="pt-32 md:pt-40">
      <SectionHeading eyebrow="Gallery" title="Moments of design" />
      <div className="mt-12">
        <GalleryFilter items={items as any} />
      </div>
    </Section>
  );
}

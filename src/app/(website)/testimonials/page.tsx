import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { MediaContainer } from "@/components/shared/media-container";
import { TestimonialCard } from "@/components/website/testimonial-card";
import { getPublishedTestimonials, getPublishedReviews } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Testimonials",
  description: "What our clients say about working with the studio.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const [testimonials, reviews] = await Promise.all([
    getPublishedTestimonials(),
    getPublishedReviews(6),
  ]);

  const withVideo = testimonials.filter((t) => t.videoUrl);

  return (
    <>
      <Section className="pt-16 md:pt-24">
        <SectionHeading
          eyebrow="Testimonials"
          title="Words from our clients"
          description="Real stories from the homeowners and businesses we've worked with."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.length > 0 ? (
            testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 6) * 0.04}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))
          ) : (
            <p className="text-muted-foreground">Testimonials will appear here once added in the CMS.</p>
          )}
        </div>
      </Section>

      {withVideo.length > 0 && (
        <Section className="bg-secondary/40">
          <SectionHeading eyebrow="Watch" title="Video testimonials" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {withVideo.map((t) => (
              <div key={t.id} className="space-y-3">
                <MediaContainer src={t.videoUrl} label="Video testimonial" kind="video" aspect="aspect-video" />
                <p className="font-medium">{t.clientName}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {reviews.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Reviews" title="From around the web" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <TestimonialCard
                key={r.id}
                testimonial={{ clientName: r.author, quote: r.body, rating: r.rating, company: r.source }}
              />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

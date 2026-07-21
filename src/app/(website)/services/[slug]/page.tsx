import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { MediaContainer } from "@/components/shared/media-container";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getServiceBySlug } from "@/services/services.service";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return buildMetadata({ title: "Service not found", path: `/services/${slug}` });
  return buildMetadata({
    title: service.metaTitle ?? service.title,
    description: service.metaDescription ?? service.excerpt ?? undefined,
    path: `/services/${slug}`,
    image: service.heroMediaUrl,
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <Section className="pt-16 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Service" title={service.title} description={service.excerpt ?? undefined} />
            <Button asChild variant="accent" className="mt-8">
              <Link href={`/contact?service=${service.slug}`}>Enquire about this service</Link>
            </Button>
          </div>
          <MediaContainer src={service.heroMediaUrl} label="Service hero" aspect="aspect-[4/3]" rounded="rounded-2xl" priority />
        </div>
      </Section>

      {service.overview && (
        <Section className="pt-0">
          <div className="prose max-w-3xl text-lg leading-relaxed text-muted-foreground">{service.overview}</div>
        </Section>
      )}

      {service.benefits.length > 0 && (
        <Section className="bg-secondary/40">
          <SectionHeading eyebrow="Why choose us" title="Benefits" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-medium">{b.title}</h3>
                {b.body && <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {service.processSteps.length > 0 && (
        <Section>
          <SectionHeading eyebrow="How it works" title="Our process" />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {service.processSteps.map((s) => (
              <div key={s.id} className="flex flex-col gap-3">
                <span className="font-heading text-3xl font-semibold text-accent">
                  {String(s.step).padStart(2, "0")}
                </span>
                <h3 className="font-medium">{s.title}</h3>
                {s.body && <p className="text-sm text-muted-foreground">{s.body}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {service.faqs.length > 0 && (
        <Section className="bg-secondary/40">
          <SectionHeading eyebrow="FAQs" title="Common questions" />
          <div className="mx-auto mt-8 max-w-3xl">
            <Accordion type="single" collapsible>
              {service.faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      )}

      <Section>
        <div className="rounded-2xl border border-border bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="mx-auto max-w-xl text-3xl font-medium">Interested in {service.title.toLowerCase()}?</h2>
          <Button asChild size="lg" variant="accent" className="mt-8">
            <Link href={`/contact?service=${service.slug}`}>Start your project</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

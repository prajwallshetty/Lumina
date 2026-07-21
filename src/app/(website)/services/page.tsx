import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { ServiceCard } from "@/components/website/service-card";
import { getPublishedServices } from "@/services/services.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "Interior design services across residential and commercial spaces.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <Section className="pt-16 md:pt-24">
      <SectionHeading
        eyebrow="Services"
        title="Everything your space needs, under one studio"
        description="Explore our full range of interior design and turnkey delivery services."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.length > 0 ? (
          services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.04}>
              <ServiceCard service={service} className="h-full" />
            </Reveal>
          ))
        ) : (
          <p className="text-muted-foreground">Services will appear here once added in the CMS.</p>
        )}
      </div>
    </Section>
  );
}

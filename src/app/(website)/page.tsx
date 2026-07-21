import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/website/home/hero";
import { ServiceCard } from "@/components/website/service-card";
import { ProjectCard } from "@/components/website/project-card";
import { TestimonialCard } from "@/components/website/testimonial-card";
import { getHomepageContent } from "@/services/homepage.service";
import { getFeaturedServices } from "@/services/services.service";
import { getFeaturedProjects } from "@/services/portfolio.service";
import { getPublishedTestimonials } from "@/services/content.service";

const PROCESS = [
  { step: "01", title: "Discovery", body: "We listen — to how you live, work and move through a space." },
  { step: "02", title: "Concept", body: "Mood, materials and spatial planning translated into a clear direction." },
  { step: "03", title: "Design", body: "Detailed drawings, 3D visualisation and a considered material palette." },
  { step: "04", title: "Delivery", body: "Turnkey execution with rigorous site management and quality control." },
];

export default async function HomePage() {
  const [home, services, projects, testimonials] = await Promise.all([
    getHomepageContent(),
    getFeaturedServices(6),
    getFeaturedProjects(6),
    getPublishedTestimonials({ featuredOnly: true, take: 3 }),
  ]);

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

      {home.showStats && home.stats.length > 0 && (
        <Section className="py-12 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {home.stats.map((stat) => (
              <div key={stat.id} className="text-center md:text-left">
                <p className="font-heading text-4xl font-semibold md:text-5xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {home.showServices && (
        <Section>
          <SectionHeading
            eyebrow="What we do"
            title="Services tailored to every space"
            description="From a single room to a full turnkey fit-out, we bring the same standard of craft to every brief."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.length > 0 ? (
              services.map((service, i) => (
                <Reveal key={service.id} delay={i * 0.05}>
                  <ServiceCard service={service} className="h-full" />
                </Reveal>
              ))
            ) : (
              <p className="text-muted-foreground">Services will appear here once added in the CMS.</p>
            )}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/services">
                All services <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {home.showProcess && (
        <Section className="bg-secondary/40">
          <SectionHeading eyebrow="How we work" title="A process built on clarity" />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((phase, i) => (
              <Reveal key={phase.step} delay={i * 0.05}>
                <div className="flex flex-col gap-3">
                  <span className="font-heading text-3xl font-semibold text-accent">{phase.step}</span>
                  <h3 className="font-heading text-lg font-medium">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground">{phase.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {home.showFeatured && (
        <Section>
          <SectionHeading
            eyebrow="Selected work"
            title="Featured projects"
            description="A considered selection of recent residential and commercial interiors."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.05}>
                  <ProjectCard project={project} />
                </Reveal>
              ))
            ) : (
              <p className="text-muted-foreground">Featured projects will appear here once published.</p>
            )}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/portfolio">
                View all projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {home.showTestimonials && testimonials.length > 0 && (
        <Section className="bg-secondary/40">
          <SectionHeading eyebrow="Client stories" title="Trusted by homeowners & businesses" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.05}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Contact CTA */}
      <Section>
        <div className="rounded-2xl border border-border bg-primary px-8 py-16 text-center text-primary-foreground md:px-16 md:py-24">
          <span className="text-eyebrow text-accent">Let&apos;s begin</span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-medium md:text-4xl">
            Ready to reimagine your space?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            Book a complimentary consultation and let&apos;s talk through your project.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href="/contact?intent=consultation">Book a consultation</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { MediaContainer } from "@/components/shared/media-container";
import { getAboutContent } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Our story, mission and the people behind the studio.",
  path: "/about",
});

export default async function AboutPage() {
  const { content, timeline, team, certificates } = await getAboutContent();

  return (
    <>
      <Section className="pb-8 pt-16 md:pt-24">
        <SectionHeading
          eyebrow="Our studio"
          title={content.storyTitle ?? "Design that lasts beyond the trend cycle"}
          description={content.storyBody ?? undefined}
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="text-eyebrow text-accent">Mission</h3>
            <p className="mt-3 text-lg leading-relaxed">
              {content.mission ?? "To craft interiors that feel inevitable — considered, functional and quietly luxurious."}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="text-eyebrow text-accent">Vision</h3>
            <p className="mt-3 text-lg leading-relaxed">
              {content.vision ?? "To be the studio clients trust with the spaces that matter most."}
            </p>
          </div>
        </div>
      </Section>

      {/* Founder */}
      <Section className="bg-secondary/40">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1fr]">
          <MediaContainer src={content.founderPhotoUrl} label="Founder photo" aspect="aspect-[4/5]" rounded="rounded-2xl" />
          <div>
            <SectionHeading eyebrow="Founder" title={content.founderName ?? "Meet the founder"} />
            {content.founderRole && <p className="mt-2 text-accent">{content.founderRole}</p>}
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {content.founderMessage ?? "A message from our founder will appear here once added in the CMS."}
            </p>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      {timeline.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Our journey" title="Milestones" />
          <div className="mt-12 space-y-8 border-l border-border pl-8">
            {timeline.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.05}>
                <div className="relative">
                  <span className="absolute -left-[2.6rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-background" />
                  <p className="font-heading text-2xl font-semibold text-accent">{event.year}</p>
                  <h3 className="mt-1 font-medium">{event.title}</h3>
                  {event.body && <p className="mt-1 text-muted-foreground">{event.body}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Team */}
      <Section className={timeline.length > 0 ? "bg-secondary/40" : undefined}>
        <SectionHeading eyebrow="The team" title="People behind the work" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.length > 0 ? (
            team.map((member, i) => (
              <Reveal key={member.id} delay={i * 0.05}>
                <div>
                  <MediaContainer src={member.photoUrl} label="Team photo" aspect="aspect-square" rounded="rounded-xl" />
                  <h3 className="mt-4 font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </Reveal>
            ))
          ) : (
            <p className="text-muted-foreground">Team members will appear here once added in the CMS.</p>
          )}
        </div>
      </Section>

      {/* Certificates */}
      {certificates.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Recognition" title="Certifications & awards" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="rounded-xl border border-border bg-card p-6">
                <MediaContainer src={cert.imageUrl} label="Certificate" aspect="aspect-[3/2]" rounded="rounded-lg" />
                <h3 className="mt-4 font-medium">{cert.title}</h3>
                {cert.issuer && <p className="text-sm text-muted-foreground">{cert.issuer} · {cert.year}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

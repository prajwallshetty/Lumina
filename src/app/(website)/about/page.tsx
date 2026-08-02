import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { MediaContainer } from "@/components/shared/media-container";
import { getAboutContent } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";
import { Quote } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Our story, mission and the people behind the studio.",
  path: "/about",
});

export default async function AboutPage() {
  const { content } = await getAboutContent();

  const hasStats =
    content.yearsOfExperienceCount ||
    content.completedProjectsCount ||
    content.clientSatisfactionCount;

  return (
    <>
      {/* Introduction split section */}
      <Section className="pt-32 md:pt-40 pb-16">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-bold tracking-[0.25em] text-accent uppercase block">
              {content.experienceText ?? "OUR STUDIO"}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-foreground">
              {content.storyTitle ?? "ABOUT LUMINA SPACES"}
            </h1>
            {content.storyBody && (
              <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line border-l-2 border-accent/35 pl-6 py-1">
                {content.storyBody}
              </p>
            )}
          </div>
          {content.officePhotoUrl && (
            <div className="lg:col-span-5">
              <Reveal>
                <div className="overflow-hidden rounded-2xl border border-border/80 shadow-md">
                  <MediaContainer
                    src={content.officePhotoUrl}
                    label="Lumina Spaces Studio Office"
                    aspect="aspect-[4/3]"
                  />
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </Section>

      {/* Statistics highlights row */}
      {hasStats && (
        <Section className="py-12 bg-secondary/10 border-y border-border/40">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            {content.yearsOfExperienceCount && (
              <Reveal delay={0.05}>
                <div className="flex flex-col items-center text-center sm:px-4">
                  <span className="font-heading text-4xl sm:text-5xl font-light text-foreground mb-1">
                    {content.yearsOfExperienceCount}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] font-semibold text-muted-foreground uppercase">
                    Years of Craft
                  </span>
                </div>
              </Reveal>
            )}
            {content.completedProjectsCount && (
              <Reveal delay={0.12}>
                <div className="flex flex-col items-center text-center sm:px-4 pt-6 sm:pt-0">
                  <span className="font-heading text-4xl sm:text-5xl font-light text-foreground mb-1">
                    {content.completedProjectsCount}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] font-semibold text-muted-foreground uppercase">
                    Projects Delivered
                  </span>
                </div>
              </Reveal>
            )}
            {content.clientSatisfactionCount && (
              <Reveal delay={0.18}>
                <div className="flex flex-col items-center text-center sm:px-4 pt-6 sm:pt-0">
                  <span className="font-heading text-4xl sm:text-5xl font-light text-foreground mb-1">
                    {content.clientSatisfactionCount}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] font-semibold text-muted-foreground uppercase">
                    Satisfaction Rate
                  </span>
                </div>
              </Reveal>
            )}
          </div>
        </Section>
      )}

      {/* Vision & Mission Core Philosophy */}
      <Section className="py-24 bg-[#FCFAF8]">
        <div className="grid gap-8 md:grid-cols-2">
          {content.mission && (
            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-accent/15 bg-white/70 backdrop-blur-md p-8 sm:p-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-heading text-2xl font-light tracking-wide text-foreground mb-4">
                    {content.missionTitle ?? "Our Mission"}
                  </h3>
                  <p className="font-body text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {content.mission}
                  </p>
                </div>
              </div>
            </Reveal>
          )}

          {content.vision && (
            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-accent/15 bg-white/70 backdrop-blur-md p-8 sm:p-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-heading text-2xl font-light tracking-wide text-foreground mb-4">
                    {content.visionTitle ?? "Our Vision"}
                  </h3>
                  <p className="font-body text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {content.vision}
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@/components/shared/section";
import { MediaContainer } from "@/components/shared/media-container";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/website/before-after-slider";
import { ProjectCard } from "@/components/website/project-card";
import { getProjectBySlug, getRelatedProjects } from "@/services/portfolio.service";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Project not found", path: `/portfolio/${slug}` });
  return buildMetadata({
    title: project.metaTitle ?? project.title,
    description: project.metaDescription ?? project.summary ?? undefined,
    path: `/portfolio/${slug}`,
    image: project.coverMediaUrl,
  });
}

const META_FIELDS = [
  ["Client", "client"],
  ["Location", "location"],
  ["Budget", "budget"],
  ["Timeline", "timeline"],
  ["Area", "area"],
  ["Year", "year"],
  ["Completion Date", "completionDate"],
] as const;

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(project.id, project.categoryId ?? null, 3);

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] items-start relative">
          
          {/* Left Column: Sticky project specs and introduction */}
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="space-y-4">
              {project.category && (
                <span className="text-[11px] font-bold tracking-[0.25em] text-accent uppercase">
                  {project.category.name}
                </span>
              )}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-foreground tracking-tight">
                {project.title}
              </h1>
              {project.summary && (
                <p className="font-body text-base text-muted-foreground leading-relaxed max-w-[480px]">
                  {project.summary}
                </p>
              )}
            </div>

            {/* Spec Table */}
            <div className="border-y border-border/60 divide-y divide-border/40 py-2">
              {META_FIELDS.map(([label, key]) => {
                const value = project[key as keyof typeof project] as string | null;
                if (!value) return null;
                return (
                  <div key={key} className="flex justify-between items-center py-3 text-sm gap-4">
                    <span className="text-muted-foreground tracking-wide font-medium">{label}</span>
                    <span className="font-semibold text-foreground text-right">{value}</span>
                  </div>
                );
              })}
              {project.designer && (
                <div className="flex justify-between items-center py-3 text-sm gap-4">
                  <span className="text-muted-foreground tracking-wide font-medium">Designer</span>
                  <span className="font-semibold text-foreground text-right">{project.designer.name}</span>
                </div>
              )}
            </div>

            {/* Materials List */}
            {project.materials.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-[0.2em] text-[#6F6F6F] uppercase">Materials Used</h4>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {project.materials.map((m) => (
                    <li key={m.id} className="flex flex-col">
                      <span className="font-semibold text-foreground">{m.name}</span>
                      {m.detail && <span className="text-xs text-muted-foreground">{m.detail}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Services Used */}
            {project.servicesUsed && project.servicesUsed.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-[0.2em] text-[#6F6F6F] uppercase">Services Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.servicesUsed.map((service: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 font-medium tracking-wide">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button asChild size="lg" className="w-full sm:w-auto font-semibold bg-[#111111] text-white hover:bg-accent tracking-wider rounded-full transition-colors duration-300">
              <Link href="/contact?intent=consultation">Start a Similar Project</Link>
            </Button>
          </div>

          {/* Right Column: Scrollable cover photo and high-end media content */}
          <div className="space-y-12">
            {/* Massive Main Cover Photo */}
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-border shadow-md">
                <MediaContainer
                  src={project.coverMediaUrl}
                  label="Project cover"
                  aspect="aspect-[16/10]"
                  priority
                />
              </div>
            </Reveal>

            {/* Project Narrative/Description */}
            {project.description && (
              <Reveal delay={0.1}>
                <div className="prose max-w-none text-base sm:text-lg leading-relaxed text-muted-foreground border-l-2 border-accent/40 pl-6 py-1 whitespace-pre-line">
                  {project.description}
                </div>
              </Reveal>
            )}

            {/* Project Showcase Video */}
            {project.videoUrl && (
              <Reveal delay={0.15}>
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl font-light tracking-wide text-foreground">Project Showcase Video</h3>
                  <div className="overflow-hidden rounded-2xl border border-border shadow-md aspect-video relative bg-black">
                    <video
                      src={project.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                    />
                  </div>
                </div>
              </Reveal>
            )}

            {/* Asymmetrical Gallery */}
            {project.images.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-heading text-2xl font-light tracking-wide text-foreground">Project Gallery</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {project.images.map((img, i) => {
                    const isFullWidth = i % 3 === 0;
                    return (
                      <div key={img.id} className={isFullWidth ? "sm:col-span-2" : ""}>
                        <Reveal delay={(i % 4) * 0.05}>
                          <div className="overflow-hidden rounded-xl border border-border hover:shadow-lg transition-shadow duration-300">
                            <MediaContainer
                              src={img.url ?? img.media?.secureUrl ?? null}
                              alt={img.alt}
                              label="Gallery image"
                              aspect={isFullWidth ? "aspect-[16/10]" : "aspect-[4/3]"}
                            />
                          </div>
                        </Reveal>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Transformations / Before & After Slider */}
            {project.beforeAfters.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="font-heading text-2xl font-light tracking-wide text-foreground">Transformations</h3>
                <div className="space-y-8">
                  {project.beforeAfters.map((ba, i) => (
                    <Reveal key={ba.id} delay={i * 0.05}>
                      <div className="space-y-3">
                        <BeforeAfterSlider beforeUrl={ba.beforeUrl} afterUrl={ba.afterUrl} title={ba.title} />
                        <div>
                          <h4 className="font-heading text-lg font-medium">{ba.title}</h4>
                          {ba.caption && <p className="text-sm text-muted-foreground">{ba.caption}</p>}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </Section>

      {/* Related Projects */}
      {related.length > 0 && (
        <Section className="bg-secondary/10 border-t border-border/50">
          <SectionHeading eyebrow="Explore More" title="Related Projects" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

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
] as const;

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(project.id, project.categoryId, 3);

  return (
    <>
      <Section className="pt-16 md:pt-24">
        <div className="flex flex-col gap-4">
          {project.category && <Badge variant="accent" className="w-fit">{project.category.name}</Badge>}
          <SectionHeading title={project.title} description={project.summary ?? undefined} />
        </div>
        <div className="mt-10">
          <MediaContainer src={project.coverMediaUrl} label="Project cover" aspect="aspect-[16/9]" rounded="rounded-2xl" priority />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-8">
            {project.description && (
              <div className="prose max-w-none text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </div>
            )}

            {project.images.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images.map((img, i) => (
                  <Reveal key={img.id} delay={(i % 4) * 0.04}>
                    <MediaContainer
                      src={img.url ?? img.media?.secureUrl ?? null}
                      alt={img.alt}
                      label="Gallery"
                      aspect="aspect-[4/3]"
                    />
                  </Reveal>
                ))}
              </div>
            )}

            {project.beforeAfters.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-heading text-xl font-medium">Before &amp; after</h3>
                {project.beforeAfters.map((ba) => (
                  <BeforeAfterSlider key={ba.id} beforeUrl={ba.beforeUrl} afterUrl={ba.afterUrl} title={ba.title} />
                ))}
              </div>
            )}
          </div>

          {/* Meta sidebar */}
          <aside className="h-fit space-y-6 rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <div className="space-y-4">
              {META_FIELDS.map(([label, key]) => {
                const value = project[key as keyof typeof project] as string | null;
                if (!value) return null;
                return (
                  <div key={key} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-right font-medium">{value}</span>
                  </div>
                );
              })}
              {project.designer && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Designer</span>
                  <span className="text-right font-medium">{project.designer.name}</span>
                </div>
              )}
            </div>

            {project.materials.length > 0 && (
              <div>
                <h4 className="text-eyebrow text-muted-foreground">Materials</h4>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {project.materials.map((m) => (
                    <li key={m.id} className="flex justify-between gap-2">
                      <span className="font-medium">{m.name}</span>
                      {m.detail && <span className="text-muted-foreground">{m.detail}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button asChild variant="accent" className="w-full">
              <Link href="/contact?intent=consultation">Start a similar project</Link>
            </Button>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="bg-secondary/40">
          <SectionHeading eyebrow="More work" title="Related projects" />
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

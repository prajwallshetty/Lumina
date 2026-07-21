import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getJobBySlug } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return buildMetadata({ title: "Position not found", path: `/careers/${slug}` });
  return buildMetadata({ title: job.title, description: job.department ?? undefined, path: `/careers/${slug}` });
}

export default async function JobDetailPage({ params }: Params) {
  const { slug } = await params;
  const [job, settings] = await Promise.all([getJobBySlug(slug), getSiteSettings().catch(() => null)]);
  if (!job) notFound();

  return (
    <Section className="pt-16 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          {job.department && <Badge variant="accent">{job.department}</Badge>}
          {job.location && (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
          )}
        </div>
        <SectionHeading className="mt-4" title={job.title} />

        {job.description && (
          <div className="prose prose-stone mt-8 max-w-none dark:prose-invert">
            <p className="whitespace-pre-line">{job.description}</p>
          </div>
        )}
        {job.requirements && (
          <div className="mt-8">
            <h2 className="font-heading text-lg font-medium">Requirements</h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{job.requirements}</p>
          </div>
        )}

        <div className="mt-10">
          <Button asChild size="lg" variant="accent">
            <a href={`mailto:${settings?.email ?? "careers@lumina.local"}?subject=Application: ${encodeURIComponent(job.title)}`}>
              Apply for this role
            </a>
          </Button>
        </div>
      </div>
    </Section>
  );
}

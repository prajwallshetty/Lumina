import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Briefcase } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { getOpenJobs } from "@/services/content.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Join the studio — current openings and how we work.",
  path: "/careers",
});

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <Section className="pt-16 md:pt-24">
      <SectionHeading
        eyebrow="Careers"
        title="Build with us"
        description="We're always looking for thoughtful designers, project managers and makers."
      />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-border">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Link
              key={job.id}
              href={`/careers/${job.slug}`}
              className="group flex items-center justify-between gap-4 py-6 transition-colors hover:bg-secondary/40"
            >
              <div>
                <h3 className="font-heading text-lg font-medium transition-colors group-hover:text-accent">
                  {job.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {job.department && <span>{job.department}</span>}
                  {job.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0">
                <Briefcase className="mr-1 h-3 w-3" /> {JOB_TYPE_LABELS[job.type]}
              </Badge>
            </Link>
          ))
        ) : (
          <p className="py-8 text-muted-foreground">No open positions right now — check back soon.</p>
        )}
      </div>
    </Section>
  );
}

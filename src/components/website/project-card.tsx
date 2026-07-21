import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaContainer } from "@/components/shared/media-container";
import { Badge } from "@/components/ui/badge";

type ProjectCardData = {
  title: string;
  slug: string;
  location?: string | null;
  coverMediaUrl?: string | null;
  category?: { name: string } | null;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl">
        <MediaContainer
          src={project.coverMediaUrl}
          alt={project.title}
          aspect="aspect-[4/5]"
          label="Project cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-medium transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {project.location && (
            <p className="text-sm text-muted-foreground">{project.location}</p>
          )}
        </div>
        {project.category && (
          <Badge variant="accent" className="shrink-0">
            {project.category.name}
          </Badge>
        )}
      </div>
    </Link>
  );
}

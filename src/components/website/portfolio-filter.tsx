"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/website/project-card";

type Project = {
  id: string;
  title: string;
  slug: string;
  location?: string | null;
  coverMediaUrl?: string | null;
  category?: { id: string; name: string; slug: string } | null;
};

type Category = { id: string; name: string; slug: string };

export function PortfolioFilter({
  projects,
  categories,
}: {
  projects: Project[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category?.slug === active)),
    [active, projects],
  );

  const filters = [{ id: "all", name: "All", slug: "all" }, ...categories];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.slug}
            onClick={() => setActive(f.slug)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === f.slug
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((project, i) => (
            <Reveal key={project.id} delay={(i % 6) * 0.04}>
              <ProjectCard project={project} />
            </Reveal>
          ))
        ) : (
          <p className="text-muted-foreground">No projects in this category yet.</p>
        )}
      </div>
    </div>
  );
}

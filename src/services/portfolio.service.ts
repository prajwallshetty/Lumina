import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getProjectCategories = cache(async () => {
  return db.projectCategory.findMany({ orderBy: { order: "asc" } });
});

export const getPublishedProjects = cache(
  async (opts?: { categorySlug?: string; tag?: string }) => {
    return db.project.findMany({
      where: {
        status: "PUBLISHED",
        ...(opts?.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
        ...(opts?.tag ? { tags: { has: opts.tag } } : {}),
      },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      include: { category: true },
    });
  },
);

export const getFeaturedProjects = cache(async (limit = 6) => {
  return db.project.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { order: "asc" },
    take: limit,
    include: { category: true },
  });
});

export const getProjectBySlug = cache(async (slug: string) => {
  return db.project.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      designer: { select: { id: true, name: true, jobTitle: true, image: true } },
      images: { orderBy: { order: "asc" }, include: { media: true } },
      materials: true,
      beforeAfters: { orderBy: { order: "asc" } },
    },
  });
});

export const getRelatedProjects = cache(
  async (projectId: string, categoryId: string | null, limit = 3) => {
    return db.project.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: projectId },
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { category: true },
    });
  },
);

export const getPublishedProjectSlugs = cache(async () => {
  return db.project.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
});

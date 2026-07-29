import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getProjectCategories = cache(async () => {
  try {
    return await db.projectCategory.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("Error in getProjectCategories:", e);
    return [];
  }
});

export const getPublishedProjects = cache(
  async (opts?: { categorySlug?: string; tag?: string }) => {
    try {
      return await db.project.findMany({
        where: {
          status: "PUBLISHED",
          ...(opts?.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
          ...(opts?.tag ? { tags: { has: opts.tag } } : {}),
        },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        include: { category: true },
      });
    } catch (e) {
      console.error("Error in getPublishedProjects:", e);
      return [];
    }
  },
);

export const getFeaturedProjects = cache(async (limit = 6) => {
  try {
    return await db.project.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { order: "asc" },
      take: limit,
      include: { category: true },
    });
  } catch (e) {
    console.error("Error in getFeaturedProjects:", e);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string) => {
  try {
    return await db.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        category: true,
        designer: { select: { id: true, name: true, jobTitle: true, image: true } },
        images: { orderBy: { order: "asc" }, include: { media: true } },
        materials: true,
        beforeAfters: { orderBy: { order: "asc" } },
      },
    });
  } catch (e) {
    console.error("Error in getProjectBySlug:", e);
    return null;
  }
});

export const getRelatedProjects = cache(
  async (projectId: string, categoryId: string | null, limit = 3) => {
    try {
      return await db.project.findMany({
        where: {
          status: "PUBLISHED",
          id: { not: projectId },
          ...(categoryId ? { categoryId } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { category: true },
      });
    } catch (e) {
      console.error("Error in getRelatedProjects:", e);
      return [];
    }
  },
);

export const getPublishedProjectSlugs = cache(async () => {
  try {
    return await db.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
  } catch (e) {
    console.error("Error in getPublishedProjectSlugs:", e);
    return [];
  }
});

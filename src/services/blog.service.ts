import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

const publishedWhere = {
  status: "PUBLISHED" as const,
  OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
};

export const getPublishedPosts = cache(
  async (opts?: { categorySlug?: string; tagSlug?: string; take?: number }) => {
    return db.blogPost.findMany({
      where: {
        ...publishedWhere,
        ...(opts?.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
        ...(opts?.tagSlug ? { tags: { some: { tag: { slug: opts.tagSlug } } } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: opts?.take,
      include: {
        category: true,
        author: { select: { name: true, image: true } },
      },
    });
  },
);

export const getPostBySlug = cache(async (slug: string) => {
  return db.blogPost.findFirst({
    where: { slug, ...publishedWhere },
    include: {
      category: true,
      author: { select: { name: true, image: true, bio: true } },
      tags: { include: { tag: true } },
    },
  });
});

export const getBlogCategories = cache(async () => {
  return db.blogCategory.findMany({ orderBy: { name: "asc" } });
});

export const getRelatedPosts = cache(
  async (postId: string, categoryId: string | null, limit = 3) => {
    return db.blogPost.findMany({
      where: { ...publishedWhere, id: { not: postId }, ...(categoryId ? { categoryId } : {}) },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: { category: true },
    });
  },
);

export const getPublishedPostSlugs = cache(async () => {
  return db.blogPost.findMany({ where: publishedWhere, select: { slug: true, updatedAt: true } });
});

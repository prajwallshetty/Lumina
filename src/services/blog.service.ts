import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

const publishedWhere = {
  status: "PUBLISHED" as const,
  OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
};

export type FallbackTag = { id: string; name: string; slug: string };
export type FallbackPostTag = { tag: FallbackTag };

export type FallbackPost = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  excerpt?: string | null;
  coverMediaUrl: string | null;
  coverUrl: string | null;
  readingTime: number | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  status: "PUBLISHED";
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  authorId: string | null;
  author: { name: string | null; image: string | null; bio?: string | null } | null;
  tags: FallbackPostTag[];
};

const FALLBACK_POSTS: Record<string, FallbackPost> = {
  "poetry-of-light-and-stone": {
    id: "post-1",
    slug: "poetry-of-light-and-stone",
    title: "The Poetry of Light and Natural Stone in Luxury Interiors",
    summary: "Exploring how natural lighting and organic stone textures transform spatial emotion.",
    content: "Architectural interiors thrive on the delicate interplay between daylight, texture, and volume...",
    metaTitle: "The Poetry of Light and Natural Stone | Lumina Spaces",
    metaDescription: "Exploring how natural lighting and organic stone textures transform spatial emotion.",
    excerpt: "Exploring how natural lighting and organic stone textures transform spatial emotion.",
    coverMediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    readingTime: 5,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "PUBLISHED",
    categoryId: "c1",
    category: { id: "c1", name: "Design Essays", slug: "essays" },
    authorId: "a1",
    author: { name: "Lumina Editorial", image: null, bio: "Insights on architecture and design." },
    tags: [],
  },
};

export const getPublishedPosts = cache(
  async (opts?: { categorySlug?: string; tagSlug?: string; take?: number }) => {
    try {
      const posts = await db.blogPost.findMany({
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
      if (posts.length > 0) return posts;
    } catch {
      // Graceful fallback
    }
    return Object.values(FALLBACK_POSTS);
  },
);

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const post = await db.blogPost.findFirst({
      where: { slug, ...publishedWhere },
      include: {
        category: true,
        author: { select: { name: true, image: true, bio: true } },
        tags: { include: { tag: true } },
      },
    });
    if (post) return post;
  } catch {
    // Graceful fallback
  }

  if (FALLBACK_POSTS[slug]) return FALLBACK_POSTS[slug];

  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const genericFallback: FallbackPost = {
    id: slug,
    slug,
    title: formattedTitle,
    summary: "Architectural design essay by Lumina Spaces.",
    content: "Exploring spatial quietness, natural light, and sensory materials in contemporary luxury homes.",
    metaTitle: `${formattedTitle} | Lumina Spaces`,
    metaDescription: "Architectural design essay by Lumina Spaces.",
    excerpt: "Architectural design essay by Lumina Spaces.",
    coverMediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    readingTime: 4,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "PUBLISHED",
    categoryId: "c1",
    category: { id: "c1", name: "Design Essays", slug: "essays" },
    authorId: "a1",
    author: { name: "Lumina Editorial", image: null, bio: "Insights on architecture and luxury design." },
    tags: [],
  };

  return genericFallback;
});

export const getBlogCategories = cache(async () => {
  try {
    const categories = await db.blogCategory.findMany({ orderBy: { name: "asc" } });
    if (categories.length > 0) return categories;
  } catch {
    // Graceful fallback
  }
  return [{ id: "c1", name: "Design Essays", slug: "essays" }];
});

export const getRelatedPosts = cache(
  async (postId: string, categoryId: string | null, limit = 3) => {
    try {
      const posts = await db.blogPost.findMany({
        where: { ...publishedWhere, id: { not: postId }, ...(categoryId ? { categoryId } : {}) },
        orderBy: { publishedAt: "desc" },
        take: limit,
        include: { category: true },
      });
      if (posts.length > 0) return posts;
    } catch {
      // Graceful fallback
    }
    return Object.values(FALLBACK_POSTS).slice(0, limit);
  },
);

export const getPublishedPostSlugs = cache(async () => {
  try {
    const slugs = await db.blogPost.findMany({ where: publishedWhere, select: { slug: true, updatedAt: true } });
    if (slugs.length > 0) return slugs;
  } catch {
    // Graceful fallback
  }
  return Object.keys(FALLBACK_POSTS).map((slug) => ({ slug, updatedAt: new Date() }));
});

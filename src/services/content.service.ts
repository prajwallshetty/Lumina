import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

// About
export const getAboutContent = cache(async () => {
  const content = await db.aboutContent.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });
  return { content };
});

// Testimonials & reviews
export const getPublishedTestimonials = cache(async (opts?: { featuredOnly?: boolean; take?: number }) => {
  return db.testimonial.findMany({
    where: { isPublished: true, ...(opts?.featuredOnly ? { isFeatured: true } : {}) },
    orderBy: { order: "asc" },
    take: opts?.take,
  });
});

export const getPublishedReviews = cache(async (take?: number) => {
  return db.review.findMany({ where: { isPublished: true }, orderBy: { reviewedAt: "desc" }, take });
});

// FAQs
export const getPublishedFaqs = cache(async () => {
  return db.faq.findMany({
    where: { isPublished: true, serviceId: null },
    orderBy: { order: "asc" },
    include: { category: true },
  });
});

// Gallery
export const getGalleryItems = cache(async () => {
  try {
    const projects = await db.project.findMany({
      where: { status: "PUBLISHED" },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
          include: { media: true },
        },
      },
    });

    const standaloneItems = await db.galleryItem.findMany({
      where: { isActive: true, isPublished: true },
      include: {
        project: {
          include: { category: true },
        },
        media: true,
      },
      orderBy: { order: "asc" },
    });

    const portfolioItems = projects.flatMap((project) => {
      return project.images.map((img) => ({
        id: `project-image-${img.id}`,
        title: img.alt || project.title,
        description: project.summary || "",
        category: project.category?.name || "General",
        url: img.url || img.media?.secureUrl || img.media?.url || "",
        type: img.media?.type || "IMAGE",
        projectId: project.id,
        isFeatured: project.isFeatured,
        createdAt: project.createdAt,
        tags: project.tags,
        order: project.order * 100 + img.order,
      }));
    });

    const standaloneMapped = standaloneItems.map((item) => ({
      id: `gallery-item-${item.id}`,
      title: item.title || item.project?.title || "Untitled",
      description: item.description || item.project?.summary || "",
      category: item.category || item.project?.category?.name || "General",
      url: item.url || item.media?.secureUrl || item.media?.url || "",
      type: item.type,
      projectId: item.projectId,
      isFeatured: item.isFeatured,
      createdAt: item.createdAt || item.project?.createdAt || new Date(0),
      tags: item.project?.tags || [],
      order: item.order,
    }));

    const combined = [...portfolioItems, ...standaloneMapped];

    return combined.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (dateB !== dateA) {
        return dateB - dateA;
      }
      return a.order - b.order;
    });
  } catch (e) {
    console.error("Error in getGalleryItems:", e);
    return [];
  }
});

// Before & After
export const getBeforeAfters = cache(async (opts?: { featuredOnly?: boolean; take?: number }) => {
  return db.beforeAfter.findMany({
    where: opts?.featuredOnly ? { isFeatured: true } : undefined,
    orderBy: { order: "asc" },
    take: opts?.take,
    include: { project: { select: { title: true, slug: true } } },
  });
});

// Brands
export const getActiveBrands = cache(async () => {
  return db.brand.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
});

// Careers
export const getOpenJobs = cache(async () => {
  return db.jobPosting.findMany({ where: { isOpen: true }, orderBy: { createdAt: "desc" } });
});

export const getJobBySlug = cache(async (slug: string) => {
  return db.jobPosting.findFirst({ where: { slug, isOpen: true } });
});

// Generic pages (privacy / terms / etc.)
export const getPageBySlug = cache(async (slug: string) => {
  return db.page.findFirst({ where: { slug, isPublished: true } });
});

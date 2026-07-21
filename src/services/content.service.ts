import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

// About
export const getAboutContent = cache(async () => {
  const [content, timeline, team, certificates] = await Promise.all([
    db.aboutContent.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } }),
    db.timelineEvent.findMany({ orderBy: { order: "asc" } }),
    db.teamMember.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    db.certificate.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { content, timeline, team, certificates };
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
  return db.galleryItem.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
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

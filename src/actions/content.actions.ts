"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { recordAudit } from "@/lib/audit";
import { MediaType, JobType } from "@prisma/client";

// --- Homepage actions ---
const homepageSchema = z.object({
  heroEyebrow: z.string().optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  heroPrimaryCtaLabel: z.string().optional().nullable(),
  heroPrimaryCtaHref: z.string().optional().nullable(),
  heroSecondaryCtaLabel: z.string().optional().nullable(),
  heroSecondaryCtaHref: z.string().optional().nullable(),
  heroMediaUrl: z.string().optional().nullable(),
  heroMediaPublicId: z.string().optional().nullable(),
  heroMediaType: z.nativeEnum(MediaType).default(MediaType.IMAGE),
  showStats: z.boolean().default(true),
  showAboutPreview: z.boolean().default(true),
  showServices: z.boolean().default(true),
  showProcess: z.boolean().default(true),
  showFeatured: z.boolean().default(true),
  showBeforeAfter: z.boolean().default(true),
  showTestimonials: z.boolean().default(true),
  showReviews: z.boolean().default(true),
  showBrands: z.boolean().default(true),
  showBlog: z.boolean().default(true),
  showFaqs: z.boolean().default(true),
});

export const updateHomepageContent = defineAction(
  { input: homepageSchema, roles: ["SUPER_ADMIN", "ADMIN"], permission: "homepage.update" },
  async ({ input, ctx }) => {
    await db.homepageContent.update({
      where: { id: "singleton" },
      data: input,
    });

    await recordAudit({
      userId: ctx?.user.id,
      action: "homepage.update",
      entityType: "HomepageContent",
    });

    revalidatePath("/");
    return ok(null);
  }
);

const statSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  order: z.number().default(0),
});

export const saveStat = defineAction(
  { input: statSchema, roles: ["SUPER_ADMIN", "ADMIN"], permission: "homepage.update" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = {
      label: input.label,
      value: input.value,
      order: input.order,
      homepageId: "singleton",
    };

    let stat;
    if (isNew) {
      stat = await db.stat.create({ data });
    } else {
      stat = await db.stat.update({ where: { id: input.id }, data });
    }

    revalidatePath("/");
    return ok(stat);
  }
);

export const deleteStat = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "homepage.update" },
  async ({ input }) => {
    await db.stat.delete({ where: { id: input.id } });
    revalidatePath("/");
    return ok(null);
  }
);

// --- About Page actions ---
const aboutSchema = z.object({
  storyTitle: z.string().optional().nullable(),
  storyBody: z.string().optional().nullable(),
  experienceText: z.string().optional().nullable(),
  yearsOfExperienceCount: z.string().optional().nullable(),
  completedProjectsCount: z.string().optional().nullable(),
  clientSatisfactionCount: z.string().optional().nullable(),
  visionTitle: z.string().optional().nullable(),
  vision: z.string().optional().nullable(),
  missionTitle: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
  founderName: z.string().optional().nullable(),
  founderRole: z.string().optional().nullable(),
  founderMessage: z.string().optional().nullable(),
  founderPhotoUrl: z.string().optional().nullable(),
  founderPhotoPublicId: z.string().optional().nullable(),
  officePhotoUrl: z.string().optional().nullable(),
  officePhotoPublicId: z.string().optional().nullable(),
});

export const updateAboutContent = defineAction(
  { input: aboutSchema, roles: ["SUPER_ADMIN", "ADMIN"], permission: "about.update" },
  async ({ input, ctx }) => {
    await db.aboutContent.update({
      where: { id: "singleton" },
      data: input,
    });

    await recordAudit({
      userId: ctx?.user.id,
      action: "about.update",
      entityType: "AboutContent",
    });

    revalidatePath("/about");
    return ok(null);
  }
);

// --- Testimonials actions ---
const testimonialSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(1, "Client Name is required"),
  company: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  rating: z.number().min(1).max(5).default(5),
  quote: z.string().min(1, "Quote is required"),
  photoUrl: z.string().optional().nullable(),
  photoPublicId: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  videoPublicId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
});

export const saveTestimonial = defineAction(
  { input: testimonialSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "testimonials.manage" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = {
      clientName: input.clientName,
      company: input.company,
      designation: input.designation,
      location: input.location,
      rating: input.rating,
      quote: input.quote,
      photoUrl: input.photoUrl,
      photoPublicId: input.photoPublicId,
      videoUrl: input.videoUrl,
      videoPublicId: input.videoPublicId,
      isFeatured: input.isFeatured,
      isPublished: input.isPublished,
      order: input.order,
    };

    let testimonial;
    if (isNew) {
      testimonial = await db.testimonial.create({ data });
    } else {
      testimonial = await db.testimonial.update({ where: { id: input.id }, data });
    }

    revalidatePath("/testimonials");
    revalidatePath("/");
    return ok(testimonial);
  }
);

export const deleteTestimonial = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "testimonials.manage" },
  async ({ input }) => {
    await db.testimonial.delete({ where: { id: input.id } });
    revalidatePath("/testimonials");
    revalidatePath("/");
    return ok(null);
  }
);

// --- FAQs actions ---
const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, "Question required"),
  answer: z.string().min(1, "Answer required"),
  categoryId: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  order: z.number().default(0),
  isPublished: z.boolean().default(true),
});

export const saveFaq = defineAction(
  { input: faqSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "faqs.manage" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = {
      question: input.question,
      answer: input.answer,
      categoryId: input.categoryId || null,
      serviceId: input.serviceId || null,
      order: input.order,
      isPublished: input.isPublished,
    };

    let faq;
    if (isNew) {
      faq = await db.faq.create({ data });
    } else {
      faq = await db.faq.update({ where: { id: input.id }, data });
    }

    revalidatePath("/faqs");
    return ok(faq);
  }
);

export const deleteFaq = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "faqs.manage" },
  async ({ input }) => {
    await db.faq.delete({ where: { id: input.id } });
    revalidatePath("/faqs");
    return ok(null);
  }
);

// FAQ Categories
const faqCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  order: z.number().default(0),
});

export const saveFaqCategory = defineAction(
  { input: faqCategorySchema, roles: ["SUPER_ADMIN", "ADMIN"], permission: "faqs.manage" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = { name: input.name, slug: input.slug, order: input.order };

    let category;
    if (isNew) {
      category = await db.faqCategory.create({ data });
    } else {
      category = await db.faqCategory.update({ where: { id: input.id }, data });
    }

    revalidatePath("/faqs");
    return ok(category);
  }
);

export const deleteFaqCategory = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "faqs.manage" },
  async ({ input }) => {
    await db.faqCategory.delete({ where: { id: input.id } });
    revalidatePath("/faqs");
    return ok(null);
  }
);

// --- Careers/Job Posting actions ---
const jobPostingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  department: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  type: z.nativeEnum(JobType).default(JobType.FULL_TIME),
  experience: z.string().optional().nullable(),
  salary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  responsibilities: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  isOpen: z.boolean().default(true),
  isPublished: z.boolean().optional().default(true),
});

export const saveJobPosting = defineAction(
  { input: jobPostingSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "careers.manage" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = {
      title: input.title,
      slug: input.slug,
      department: input.department,
      location: input.location,
      type: input.type,
      experience: input.experience,
      salary: input.salary,
      description: input.description,
      responsibilities: input.responsibilities,
      requirements: input.requirements,
      benefits: input.benefits,
      isOpen: input.isOpen,
      isPublished: input.isPublished ?? true,
    };

    let job;
    if (isNew) {
      job = await db.jobPosting.create({ data });
    } else {
      job = await db.jobPosting.update({ where: { id: input.id }, data });
    }

    revalidatePath("/careers");
    revalidatePath(`/careers/${job.slug}`);
    return ok(job);
  }
);

export const deleteJobPosting = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "careers.manage" },
  async ({ input }) => {
    await db.jobPosting.delete({ where: { id: input.id } });
    revalidatePath("/careers");
    return ok(null);
  }
);

// --- Gallery actions ---
const gallerySchema = z.object({
  id: z.string().optional(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  url: z.string().min(1, "URL is required"),
  publicId: z.string().optional().nullable(),
  type: z.nativeEnum(MediaType).default(MediaType.IMAGE),
  projectId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().optional().default(true),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const saveGalleryItem = defineAction(
  { input: gallerySchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "gallery.manage" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = {
      title: input.title,
      description: input.description,
      category: input.category,
      url: input.url,
      publicId: input.publicId,
      type: input.type,
      projectId: input.projectId || null,
      isFeatured: input.isFeatured,
      isPublished: input.isPublished ?? true,
      order: input.order,
      isActive: input.isActive,
    };

    let item;
    if (isNew) {
      item = await db.galleryItem.create({ data });
    } else {
      item = await db.galleryItem.update({ where: { id: input.id }, data });
    }

    revalidatePath("/gallery");
    revalidatePath("/");
    return ok(item);
  }
);

export const deleteGalleryItem = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "gallery.manage" },
  async ({ input }) => {
    await db.galleryItem.delete({ where: { id: input.id } });
    revalidatePath("/gallery");
    revalidatePath("/");
    return ok(null);
  }
);

// --- Before & After transformation actions ---
const beforeAfterGeneralSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title required"),
  caption: z.string().optional().nullable(),
  sketchUrl: z.string().optional().nullable(),
  sketchPublicId: z.string().optional().nullable(),
  beforeUrl: z.string().min(1, "Before Image is required"),
  beforePublicId: z.string().optional().nullable(),
  afterUrl: z.string().min(1, "After Image is required"),
  afterPublicId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().optional().default(true),
  order: z.number().default(0),
});

export const saveBeforeAfter = defineAction(
  { input: beforeAfterGeneralSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "portfolio.create" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = {
      title: input.title,
      caption: input.caption,
      sketchUrl: input.sketchUrl,
      sketchPublicId: input.sketchPublicId,
      beforeUrl: input.beforeUrl,
      beforePublicId: input.beforePublicId,
      afterUrl: input.afterUrl,
      afterPublicId: input.afterPublicId,
      projectId: input.projectId || null,
      isFeatured: input.isFeatured,
      isPublished: input.isPublished ?? true,
      order: input.order,
    };

    let record;
    if (isNew) {
      record = await db.beforeAfter.create({ data });
    } else {
      record = await db.beforeAfter.update({ where: { id: input.id }, data });
    }

    revalidatePath("/before-after");
    revalidatePath("/");
    return ok(record);
  }
);

export const deleteBeforeAfter = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "portfolio.delete" },
  async ({ input }) => {
    await db.beforeAfter.delete({ where: { id: input.id } });
    revalidatePath("/before-after");
    revalidatePath("/");
    return ok(null);
  }
);

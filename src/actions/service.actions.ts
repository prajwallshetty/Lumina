"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { recordAudit } from "@/lib/audit";

const serviceBenefitSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  body: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().default(0),
});

const serviceProcessSchema = z.object({
  id: z.string().optional(),
  step: z.number(),
  title: z.string().min(1, "Title is required"),
  body: z.string().optional(),
});

const serviceFaqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  categoryId: z.string().nullable().optional(),
  order: z.number().default(0),
  isPublished: z.boolean().default(true),
});

const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional().nullable(),
  overview: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  heroMediaUrl: z.string().optional().nullable(),
  heroMediaPublicId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  benefits: z.array(serviceBenefitSchema).default([]),
  processSteps: z.array(serviceProcessSchema).default([]),
  faqs: z.array(serviceFaqSchema).default([]),
});

export const saveService = defineAction(
  { input: serviceSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "services.create" },
  async ({ input, ctx }) => {
    const isNew = !input.id;
    
    const data: any = {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      overview: input.overview,
      icon: input.icon,
      heroMediaUrl: input.heroMediaUrl,
      heroMediaPublicId: input.heroMediaPublicId,
      isFeatured: input.isFeatured,
      isPublished: input.isPublished,
      order: input.order,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
    };

    const service = await db.$transaction(async (tx) => {
      let svc;
      if (isNew) {
        svc = await tx.service.create({ data });
      } else {
        svc = await tx.service.update({
          where: { id: input.id },
          data,
        });
      }

      // Sync benefits
      await tx.serviceBenefit.deleteMany({ where: { serviceId: svc.id } });
      if (input.benefits.length > 0) {
        await tx.serviceBenefit.createMany({
          data: input.benefits.map((b) => ({
            title: b.title,
            body: b.body || null,
            icon: b.icon || null,
            order: b.order,
            serviceId: svc.id,
          })),
        });
      }

      // Sync process steps
      await tx.serviceProcessStep.deleteMany({ where: { serviceId: svc.id } });
      if (input.processSteps.length > 0) {
        await tx.serviceProcessStep.createMany({
          data: input.processSteps.map((p) => ({
            step: p.step,
            title: p.title,
            body: p.body || null,
            serviceId: svc.id,
          })),
        });
      }

      // Sync FAQs
      await tx.faq.deleteMany({ where: { serviceId: svc.id } });
      if (input.faqs.length > 0) {
        await tx.faq.createMany({
          data: input.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
            categoryId: f.categoryId || null,
            order: f.order,
            isPublished: f.isPublished,
            serviceId: svc.id,
          })),
        });
      }

      return svc;
    });

    await recordAudit({
      userId: ctx?.user.id,
      action: isNew ? "services.create" : "services.update",
      entityType: "Service",
      entityId: service.id,
      metadata: { title: service.title },
    });

    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);
    revalidatePath("/", "layout");

    return ok(service);
  }
);

export const deleteService = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "services.delete" },
  async ({ input, ctx }) => {
    const service = await db.service.delete({ where: { id: input.id } });
    
    await recordAudit({
      userId: ctx?.user.id,
      action: "services.delete",
      entityType: "Service",
      entityId: input.id,
      metadata: { title: service.title },
    });

    revalidatePath("/services");
    revalidatePath("/", "layout");
    return ok(null);
  }
);

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { recordAudit } from "@/lib/audit";
import { ProjectStatus } from "@prisma/client";

const projectImageSchema = z.object({
  url: z.string().nullable().optional(),
  publicId: z.string().nullable().optional(),
  alt: z.string().nullable().optional(),
  order: z.number().default(0),
});

const projectMaterialSchema = z.object({
  name: z.string().min(1, "Material name required"),
  detail: z.string().optional().nullable(),
});

const beforeAfterSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  caption: z.string().optional().nullable(),
  beforeUrl: z.string().optional().nullable(),
  beforePublicId: z.string().optional().nullable(),
  afterUrl: z.string().optional().nullable(),
  afterPublicId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
});

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  area: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DRAFT),
  isFeatured: z.boolean().default(false),
  coverMediaUrl: z.string().optional().nullable(),
  coverMediaPublicId: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  videoPublicId: z.string().optional().nullable(),
  designerId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  order: z.number().default(0),
  images: z.array(projectImageSchema).default([]),
  materials: z.array(projectMaterialSchema).default([]),
  beforeAfters: z.array(beforeAfterSchema).default([]),
});

export const saveProject = defineAction(
  { input: projectSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "portfolio.create" },
  async ({ input, ctx }) => {
    const isNew = !input.id;
    const data: any = {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      description: input.description,
      categoryId: input.categoryId || null,
      client: input.client,
      location: input.location,
      budget: input.budget,
      timeline: input.timeline,
      area: input.area,
      year: input.year,
      status: input.status,
      isFeatured: input.isFeatured,
      coverMediaUrl: input.coverMediaUrl,
      coverMediaPublicId: input.coverMediaPublicId,
      videoUrl: input.videoUrl,
      videoPublicId: input.videoPublicId,
      designerId: input.designerId || null,
      tags: input.tags,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      order: input.order,
    };

    const project = await db.$transaction(async (tx) => {
      let proj;
      if (isNew) {
        proj = await tx.project.create({ data });
      } else {
        proj = await tx.project.update({
          where: { id: input.id },
          data,
        });
      }

      // Sync project images
      await tx.projectImage.deleteMany({ where: { projectId: proj.id } });
      if (input.images.length > 0) {
        await tx.projectImage.createMany({
          data: input.images.map((img) => ({
            projectId: proj.id,
            url: img.url || null,
            publicId: img.publicId || null,
            alt: img.alt || null,
            order: img.order,
          })),
        });
      }

      // Sync materials
      await tx.projectMaterial.deleteMany({ where: { projectId: proj.id } });
      if (input.materials.length > 0) {
        await tx.projectMaterial.createMany({
          data: input.materials.map((m) => ({
            projectId: proj.id,
            name: m.name,
            detail: m.detail || null,
          })),
        });
      }

      // Sync before afters
      await tx.beforeAfter.deleteMany({ where: { projectId: proj.id } });
      if (input.beforeAfters.length > 0) {
        await tx.beforeAfter.createMany({
          data: input.beforeAfters.map((ba) => ({
            title: ba.title,
            caption: ba.caption || null,
            beforeUrl: ba.beforeUrl || null,
            beforePublicId: ba.beforePublicId || null,
            afterUrl: ba.afterUrl || null,
            afterPublicId: ba.afterPublicId || null,
            isFeatured: ba.isFeatured,
            order: ba.order,
            projectId: proj.id,
          })),
        });
      }

      return proj;
    });

    await recordAudit({
      userId: ctx?.user.id,
      action: isNew ? "portfolio.create" : "portfolio.update",
      entityType: "Project",
      entityId: project.id,
      metadata: { title: project.title },
    });

    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${project.slug}`);
    revalidatePath("/", "layout");

    return ok(project);
  }
);

export const deleteProject = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "portfolio.delete" },
  async ({ input, ctx }) => {
    const project = await db.project.delete({ where: { id: input.id } });
    
    await recordAudit({
      userId: ctx?.user.id,
      action: "portfolio.delete",
      entityType: "Project",
      entityId: input.id,
      metadata: { title: project.title },
    });

    revalidatePath("/portfolio");
    revalidatePath("/", "layout");
    return ok(null);
  }
);

// Project Categories Actions
const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  order: z.number().default(0),
});

export const saveProjectCategory = defineAction(
  { input: categorySchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "portfolio.create" },
  async ({ input, ctx }) => {
    const isNew = !input.id;
    const data = {
      name: input.name,
      slug: input.slug,
      order: input.order,
    };

    let category;
    if (isNew) {
      category = await db.projectCategory.create({ data });
    } else {
      category = await db.projectCategory.update({
        where: { id: input.id },
        data,
      });
    }

    await recordAudit({
      userId: ctx?.user.id,
      action: isNew ? "portfolio.category.create" : "portfolio.category.update",
      entityType: "ProjectCategory",
      entityId: category.id,
      metadata: { name: category.name },
    });

    revalidatePath("/portfolio");
    return ok(category);
  }
);

export const deleteProjectCategory = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "portfolio.delete" },
  async ({ input, ctx }) => {
    const category = await db.projectCategory.delete({ where: { id: input.id } });
    
    await recordAudit({
      userId: ctx?.user.id,
      action: "portfolio.category.delete",
      entityType: "ProjectCategory",
      entityId: input.id,
      metadata: { name: category.name },
    });

    revalidatePath("/portfolio");
    return ok(null);
  }
);

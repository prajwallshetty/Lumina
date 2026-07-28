"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { recordAudit } from "@/lib/audit";

const seoMetaSchema = z.object({
  id: z.string().optional(),
  path: z.string().min(1, "Path is required"),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  canonical: z.string().optional().nullable(),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  twitterCard: z.string().default("summary_large_image"),
  robots: z.string().default("index,follow"),
});

export const saveSeoMeta = defineAction(
  { input: seoMetaSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "settings.update" },
  async ({ input, ctx }) => {
    const isNew = !input.id;
    const data = {
      path: input.path,
      title: input.title,
      description: input.description,
      canonical: input.canonical,
      ogTitle: input.ogTitle,
      ogDescription: input.ogDescription,
      ogImageUrl: input.ogImageUrl,
      twitterCard: input.twitterCard,
      robots: input.robots,
    };

    let record;
    if (isNew) {
      record = await db.seoMeta.create({ data });
    } else {
      record = await db.seoMeta.update({ where: { id: input.id }, data });
    }

    await recordAudit({
      userId: ctx?.user.id,
      action: isNew ? "seo.create" : "seo.update",
      entityType: "SeoMeta",
      entityId: record.id,
      metadata: { path: record.path },
    });

    revalidatePath("/", "layout");
    return ok(record);
  }
);

export const deleteSeoMeta = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "settings.update" },
  async ({ input, ctx }) => {
    const record = await db.seoMeta.delete({ where: { id: input.id } });
    await recordAudit({
      userId: ctx?.user.id,
      action: "seo.delete",
      entityType: "SeoMeta",
      entityId: input.id,
      metadata: { path: record.path },
    });
    revalidatePath("/", "layout");
    return ok(null);
  }
);

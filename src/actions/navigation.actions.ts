"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { NavLocation } from "@prisma/client";

const navItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "URL path is required"),
  location: z.nativeEnum(NavLocation).default(NavLocation.HEADER),
  group: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const saveNavItem = defineAction(
  { input: navItemSchema, roles: ["SUPER_ADMIN", "ADMIN"], permission: "settings.update" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = {
      label: input.label,
      href: input.href,
      location: input.location,
      group: input.group || null,
      parentId: input.parentId || null,
      order: input.order,
      isActive: input.isActive,
    };

    let item;
    if (isNew) {
      item = await db.navItem.create({ data });
    } else {
      item = await db.navItem.update({ where: { id: input.id }, data });
    }

    revalidatePath("/", "layout");
    return ok(item);
  }
);

export const deleteNavItem = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "settings.update" },
  async ({ input }) => {
    await db.navItem.delete({ where: { id: input.id } });
    revalidatePath("/", "layout");
    return ok(null);
  }
);

export const saveSocialLink = defineAction(
  { input: z.object({ id: z.string().optional(), platform: z.string(), url: z.string(), order: z.number().default(0), isActive: z.boolean().default(true) }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "settings.update" },
  async ({ input }) => {
    const isNew = !input.id;
    const data = {
      platform: input.platform,
      url: input.url,
      order: input.order,
      isActive: input.isActive,
    };
    let link;
    if (isNew) {
      link = await db.socialLink.create({ data });
    } else {
      link = await db.socialLink.update({ where: { id: input.id }, data });
    }
    revalidatePath("/", "layout");
    return ok(link);
  }
);

export const deleteSocialLink = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "settings.update" },
  async ({ input }) => {
    await db.socialLink.delete({ where: { id: input.id } });
    revalidatePath("/", "layout");
    return ok(null);
  }
);

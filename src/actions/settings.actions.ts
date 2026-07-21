"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { recordAudit } from "@/lib/audit";

const settingsSchema = z.object({
  companyName: z.string().min(1),
  tagline: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  metaPixelId: z.string().optional(),
});

export const updateSettings = defineAction(
  { input: settingsSchema, roles: ["SUPER_ADMIN", "ADMIN"], permission: "settings.update" },
  async ({ input, ctx }) => {
    await db.siteSettings.update({ where: { id: "singleton" }, data: input });
    await recordAudit({ userId: ctx?.user.id, action: "settings.update", entityType: "SiteSettings" });
    revalidatePath("/", "layout");
    return ok(null);
  },
);

const maintenanceSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().optional(),
});

export const updateMaintenance = defineAction(
  { input: maintenanceSchema, roles: ["SUPER_ADMIN", "ADMIN"], permission: "settings.update" },
  async ({ input, ctx }) => {
    await db.siteSettings.update({ where: { id: "singleton" }, data: input });
    await recordAudit({
      userId: ctx?.user.id,
      action: "settings.maintenance",
      entityType: "SiteSettings",
      metadata: { enabled: input.maintenanceMode },
    });
    revalidatePath("/", "layout");
    return ok(null);
  },
);

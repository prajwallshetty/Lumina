"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { deleteAsset } from "@/lib/cloudinary";
import { MediaType } from "@prisma/client";

const registerAssetSchema = z.object({
  publicId: z.string(),
  url: z.string(),
  secureUrl: z.string(),
  type: z.nativeEnum(MediaType).default(MediaType.IMAGE),
  format: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  bytes: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  alt: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  folderId: z.string().optional().nullable(),
});

export const registerUploadedAsset = defineAction(
  { input: registerAssetSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "DESIGNER"], permission: "media.upload" },
  async ({ input, ctx }) => {
    const asset = await db.media.create({
      data: {
        publicId: input.publicId,
        url: input.url,
        secureUrl: input.secureUrl,
        type: input.type,
        format: input.format,
        width: input.width,
        height: input.height,
        bytes: input.bytes,
        duration: input.duration,
        alt: input.alt,
        caption: input.caption,
        folderId: input.folderId || null,
        uploadedById: ctx?.user.id || null,
      },
    });

    return ok(asset);
  }
);

export const deleteAssetAction = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "media.delete" },
  async ({ input }) => {
    const asset = await db.media.findUnique({ where: { id: input.id } });
    if (!asset) return ok(null);

    // Call Cloudinary API
    try {
      const resourceType = asset.type === MediaType.VIDEO ? "video" : "image";
      await deleteAsset(asset.publicId, resourceType);
    } catch (e) {
      console.error("Cloudinary asset delete error:", e);
    }

    // Delete database row
    await db.media.delete({ where: { id: input.id } });

    return ok(null);
  }
);

// Folder actions
export const createMediaFolder = defineAction(
  { input: z.object({ name: z.string().min(1), parentId: z.string().nullable().optional() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "media.upload" },
  async ({ input }) => {
    const slug = `${input.parentId || "root"}-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const folder = await db.mediaFolder.create({
      data: {
        name: input.name,
        slug,
        parentId: input.parentId || null,
      },
    });
    return ok(folder);
  }
);

export const deleteMediaFolder = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "media.delete" },
  async ({ input }) => {
    await db.mediaFolder.delete({ where: { id: input.id } });
    return ok(null);
  }
);

export const getUploadSignatureAction = defineAction(
  { roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "DESIGNER"], permission: "media.upload" },
  async () => {
    const { createUploadSignature } = await import("@/lib/cloudinary");
    return ok(createUploadSignature());
  }
);

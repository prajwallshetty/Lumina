"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { recordAudit } from "@/lib/audit";
import { PostStatus } from "@prisma/client";

const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  coverPublicId: z.string().optional().nullable(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  publishedAt: z.coerce.date().optional().nullable(),
  readingTime: z.number().int().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  tagIds: z.array(z.string()).default([]),
});

export const savePost = defineAction(
  { input: blogPostSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "blog.create" },
  async ({ input, ctx }) => {
    const isNew = !input.id;
    
    // Automatically calculate reading time if not supplied: roughly 200 words per minute
    let readingTime = input.readingTime;
    if (!readingTime && input.content) {
      const words = input.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
      readingTime = Math.max(1, Math.ceil(words / 200));
    }

    const data: any = {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      coverUrl: input.coverUrl,
      coverPublicId: input.coverPublicId,
      status: input.status,
      publishedAt: input.status === "PUBLISHED" ? (input.publishedAt || new Date()) : input.publishedAt,
      readingTime: readingTime || 1,
      categoryId: input.categoryId || null,
      authorId: input.authorId || ctx?.user.id || null,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
    };

    const post = await db.$transaction(async (tx) => {
      let p;
      if (isNew) {
        p = await tx.blogPost.create({ data });
      } else {
        p = await tx.blogPost.update({
          where: { id: input.id },
          data,
        });
      }

      // Sync tags
      await tx.blogPostTag.deleteMany({ where: { postId: p.id } });
      if (input.tagIds.length > 0) {
        await tx.blogPostTag.createMany({
          data: input.tagIds.map((tagId) => ({
            postId: p.id,
            tagId,
          })),
        });
      }

      return p;
    });

    await recordAudit({
      userId: ctx?.user.id,
      action: isNew ? "blog.create" : "blog.update",
      entityType: "BlogPost",
      entityId: post.id,
      metadata: { title: post.title },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/", "layout");

    return ok(post);
  }
);

export const deletePost = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "blog.delete" },
  async ({ input, ctx }) => {
    const post = await db.blogPost.delete({ where: { id: input.id } });
    
    await recordAudit({
      userId: ctx?.user.id,
      action: "blog.delete",
      entityType: "BlogPost",
      entityId: input.id,
      metadata: { title: post.title },
    });

    revalidatePath("/blog");
    revalidatePath("/", "layout");
    return ok(null);
  }
);

// Blog Categories Actions
const blogCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
});

export const saveBlogCategory = defineAction(
  { input: blogCategorySchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "blog.create" },
  async ({ input, ctx }) => {
    const isNew = !input.id;
    const data = { name: input.name, slug: input.slug };

    let category;
    if (isNew) {
      category = await db.blogCategory.create({ data });
    } else {
      category = await db.blogCategory.update({ where: { id: input.id }, data });
    }

    await recordAudit({
      userId: ctx?.user.id,
      action: isNew ? "blog.category.create" : "blog.category.update",
      entityType: "BlogCategory",
      entityId: category.id,
      metadata: { name: category.name },
    });

    revalidatePath("/blog");
    return ok(category);
  }
);

export const deleteBlogCategory = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "blog.delete" },
  async ({ input, ctx }) => {
    const category = await db.blogCategory.delete({ where: { id: input.id } });
    
    await recordAudit({
      userId: ctx?.user.id,
      action: "blog.category.delete",
      entityType: "BlogCategory",
      entityId: input.id,
      metadata: { name: category.name },
    });

    revalidatePath("/blog");
    return ok(null);
  }
);

// Blog Tags Actions
const blogTagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
});

export const saveBlogTag = defineAction(
  { input: blogTagSchema, roles: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"], permission: "blog.create" },
  async ({ input, ctx }) => {
    const isNew = !input.id;
    const data = { name: input.name, slug: input.slug };

    let tag;
    if (isNew) {
      tag = await db.blogTag.create({ data });
    } else {
      tag = await db.blogTag.update({ where: { id: input.id }, data });
    }

    await recordAudit({
      userId: ctx?.user.id,
      action: isNew ? "blog.tag.create" : "blog.tag.update",
      entityType: "BlogTag",
      entityId: tag.id,
      metadata: { name: tag.name },
    });

    return ok(tag);
  }
);

export const deleteBlogTag = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "blog.delete" },
  async ({ input, ctx }) => {
    await db.blogTag.delete({ where: { id: input.id } });
    return ok(null);
  }
);

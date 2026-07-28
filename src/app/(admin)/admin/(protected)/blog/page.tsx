import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { BlogManager } from "@/components/admin/blog-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const [posts, categories, tags, authors] = await Promise.all([
    db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
      },
    }),
    db.blogCategory.findMany({ orderBy: { name: "asc" } }),
    db.blogTag.findMany({ orderBy: { name: "asc" } }),
    db.user.findMany({
      where: { role: { not: "VIEWER" }, isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        description="Write and manage articles with categories, tags and SEO."
      />
      <BlogManager posts={posts} categories={categories} tags={tags} authors={authors} />
    </div>
  );
}

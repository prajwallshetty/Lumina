import type { Metadata } from "next";
import { Plus, Newspaper } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate } from "@/utils";

export const metadata: Metadata = { title: "Blog" };

const STATUS_VARIANT = { PUBLISHED: "success", DRAFT: "secondary", SCHEDULED: "warning" } as const;

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        description="Write and manage articles with categories, tags and SEO."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> New post
          </Button>
        }
      />

      {posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Publish your first article to grow organic traffic." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="text-muted-foreground">{post.category?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{post.author?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[post.status]}>{post.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(post.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

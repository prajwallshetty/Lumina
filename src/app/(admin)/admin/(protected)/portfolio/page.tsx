import type { Metadata } from "next";
import { Plus, FolderKanban } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate } from "@/utils";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Portfolio"
        description="Manage projects, galleries, before/after and materials."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> New project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to showcase your work on the website."
          action={
            <Button variant="accent">
              <Plus className="h-4 w-4" /> New project
            </Button>
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">{p.category?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "PUBLISHED" ? "success" : "secondary"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell>{p.isFeatured ? "Yes" : "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(p.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

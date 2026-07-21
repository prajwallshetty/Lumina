import type { Metadata } from "next";
import { Plus, Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"]);
  const overrides = await db.seoMeta.findMany({ orderBy: { path: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="SEO"
        description="Per-path meta, Open Graph, Twitter cards, canonical, robots and structured data."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> Add override
          </Button>
        }
      />

      {overrides.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No SEO overrides"
          description="Pages use sensible defaults. Add an override to customise a specific path."
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Robots</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overrides.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.path}</TableCell>
                  <TableCell className="text-muted-foreground">{o.title ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{o.robots ?? "index,follow"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

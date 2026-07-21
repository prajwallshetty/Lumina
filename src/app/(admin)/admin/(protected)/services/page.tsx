import type { Metadata } from "next";
import { Plus, Wrench } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await db.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services"
        description="Each service is its own page with overview, benefits, process and FAQs."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> New service
          </Button>
        }
      />

      {services.length === 0 ? (
        <EmptyState icon={Wrench} title="No services yet" description="Add the services your studio offers." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{s.slug}</TableCell>
                  <TableCell>{s.isFeatured ? "Yes" : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={s.isPublished ? "success" : "secondary"}>
                      {s.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

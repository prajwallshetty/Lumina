import type { Metadata } from "next";
import { Plus, Quote, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        description="Client quotes, ratings and video testimonials."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> New testimonial
          </Button>
        }
      />

      {testimonials.length === 0 ? (
        <EmptyState icon={Quote} title="No testimonials yet" description="Collect and showcase client feedback." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.clientName}</TableCell>
                  <TableCell className="text-muted-foreground">{t.company ?? "—"}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {t.rating}
                    </span>
                  </TableCell>
                  <TableCell>{t.isFeatured ? "Yes" : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={t.isPublished ? "success" : "secondary"}>
                      {t.isPublished ? "Published" : "Hidden"}
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

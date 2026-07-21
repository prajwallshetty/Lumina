import type { Metadata } from "next";
import { Plus, HelpCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  const faqs = await db.faq.findMany({
    orderBy: { order: "asc" },
    include: { category: true, service: { select: { title: true } } },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQs"
        description="Global and per-service frequently asked questions."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> New FAQ
          </Button>
        }
      />

      {faqs.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No FAQs yet" description="Answer common questions to reduce inbound queries." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="max-w-md truncate font-medium">{faq.question}</TableCell>
                  <TableCell className="text-muted-foreground">{faq.category?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{faq.service?.title ?? "Global"}</TableCell>
                  <TableCell>
                    <Badge variant={faq.isPublished ? "success" : "secondary"}>
                      {faq.isPublished ? "Published" : "Hidden"}
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

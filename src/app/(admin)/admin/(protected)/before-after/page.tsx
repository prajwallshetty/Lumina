import type { Metadata } from "next";
import { Plus, ArrowLeftRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { MediaContainer } from "@/components/shared/media-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Before & After" };

export default async function AdminBeforeAfterPage() {
  const items = await db.beforeAfter.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Before & After"
        description="Manage the interactive before/after comparisons shown on the site."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> New comparison
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState icon={ArrowLeftRight} title="No comparisons yet" description="Add a before and after pair to showcase transformations." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="space-y-3 p-4">
                <div className="grid grid-cols-2 gap-2">
                  <MediaContainer src={item.beforeUrl} label="Before" aspect="aspect-square" rounded="rounded-lg" />
                  <MediaContainer src={item.afterUrl} label="After" aspect="aspect-square" rounded="rounded-lg" />
                </div>
                <p className="text-sm font-medium">{item.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

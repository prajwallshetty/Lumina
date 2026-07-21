import type { Metadata } from "next";
import { Plus, Images } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { MediaContainer } from "@/components/shared/media-container";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const items = await db.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery"
        description="Curate the public gallery grid. Upload assets from the Media Library."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> Add item
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState icon={Images} title="No gallery items yet" description="Add images to build your gallery." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <MediaContainer key={item.id} src={item.url} label={item.category ?? "Gallery"} aspect="aspect-square" />
          ))}
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const [items, projects] = await Promise.all([
    db.galleryItem.findMany({ orderBy: { order: "asc" }, include: { project: true } }),
    db.project.findMany({ select: { id: true, title: true } }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery"
        description="Curate the public gallery grid. Upload assets from the Media Library."
      />
      <GalleryManager items={items} projects={projects} />
    </div>
  );
}

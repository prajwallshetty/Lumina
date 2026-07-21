import type { Metadata } from "next";
import { Upload, ImagePlus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { MediaContainer } from "@/components/shared/media-container";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  const [media, folders] = await Promise.all([
    db.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
    db.mediaFolder.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Library"
        description="Cloudinary-backed assets. Drag & drop, bulk upload, folders and search."
        actions={
          <Button variant="accent">
            <Upload className="h-4 w-4" /> Upload
          </Button>
        }
      />

      {folders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {folders.map((f) => (
            <span key={f.id} className="rounded-md border border-border px-3 py-1 text-sm text-muted-foreground">
              {f.name}
            </span>
          ))}
        </div>
      )}

      {media.length === 0 ? (
        <EmptyState
          icon={ImagePlus}
          title="Your media library is empty"
          description="Upload images and videos here, then reference them across the CMS."
          action={
            <Button variant="accent">
              <Upload className="h-4 w-4" /> Upload assets
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {media.map((m) => (
            <MediaContainer
              key={m.id}
              src={m.secureUrl}
              alt={m.alt}
              label={m.type}
              kind={m.type === "VIDEO" ? "video" : "image"}
              aspect="aspect-square"
              rounded="rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

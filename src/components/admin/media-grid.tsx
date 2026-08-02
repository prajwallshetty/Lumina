"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { MediaContainer } from "@/components/shared/media-container";
import { deleteAssetAction } from "@/actions/media.actions";
import { toast } from "sonner";

type MediaItem = {
  id: string;
  secureUrl: string;
  alt: string | null;
  type: string;
};

type Props = {
  initialMedia: MediaItem[];
};

export function MediaGrid({ initialMedia }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      const res = await deleteAssetAction({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Asset deleted successfully.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete asset.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {initialMedia.map((m) => (
        <div key={m.id} className="relative group overflow-hidden rounded-lg border border-border">
          <MediaContainer
            src={m.secureUrl}
            alt={m.alt}
            label={m.type}
            kind={m.type === "VIDEO" ? "video" : "image"}
            aspect="aspect-square"
            rounded="rounded-none"
          />
          <button
            type="button"
            onClick={() => handleDelete(m.id)}
            disabled={deletingId === m.id}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-destructive hover:scale-105 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-100 disabled:bg-destructive"
            title="Delete asset"
          >
            {deletingId === m.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

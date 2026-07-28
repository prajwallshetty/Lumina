"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MediaUploader } from "./media-uploader";
import { saveGalleryItem, deleteGalleryItem } from "@/actions/content.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  items: any[];
};

export function GalleryManager({ items }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const handleOpenNew = () => {
    setSelected(null);
    setTitle("");
    setCategory("");
    setUrl("");
    setPublicId("");
    setOrder(0);
    setIsActive(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelected(item);
    setTitle(item.title || "");
    setCategory(item.category || "");
    setUrl(item.url || "");
    setPublicId(item.publicId || "");
    setOrder(item.order || 0);
    setIsActive(item.isActive);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!url) return toast.error("Image file is required.");
    try {
      setLoading(true);
      const res = await saveGalleryItem({
        id: selected?.id,
        title,
        category,
        url,
        publicId,
        order: Number(order),
        isActive,
        type: "IMAGE",
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Gallery item saved.");
      setIsOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteGalleryItem({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Gallery item deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const filtered = items.filter((item) =>
    (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Filter by title/category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
          <Plus className="mr-1.5 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((item) => (
          <Card key={item.id} className="relative overflow-hidden group border border-border bg-card flex flex-col justify-between">
            <div className="relative aspect-square w-full bg-muted">
              {item.url && <Image src={item.url} alt={item.title || "Gallery"} fill className="object-cover" unoptimized />}
              {!item.isActive && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center">
                  <Badge variant="secondary">Hidden</Badge>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-accent font-semibold tracking-wider uppercase">{item.category || "General"}</p>
                <h3 className="font-medium text-sm mt-1">{item.title || "Untitled Moment"}</h3>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Gallery Item" : "New Gallery Item"}</DialogTitle>
            <DialogDescription>Curate public grid photos for Lumina space moments.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Image Upload</Label>
              <MediaUploader value={url} onChange={(url, id) => { setUrl(url); if (id) setPublicId(id); }} onClear={() => { setUrl(""); setPublicId(""); }} />
            </div>
            <div className="space-y-2">
              <Label>Title / Caption (Optional)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Modern Brass Detailing" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Residential" />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Active (Visible in public gallery)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="gap-1.5 bg-[#b08d57] text-white hover:bg-[#b08d57]/90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

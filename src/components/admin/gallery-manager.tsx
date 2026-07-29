"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, Loader2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MediaUploader } from "./media-uploader";
import { saveGalleryItem, deleteGalleryItem } from "@/actions/content.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const GALLERY_CATEGORIES = [
  "Residential",
  "Commercial",
  "Hospitality",
  "Construction",
  "Office",
  "Turnkey",
];

type Props = {
  items: any[];
};

export function GalleryManager({ items }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Residential");
  const [url, setUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [order, setOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const handleOpenNew = () => {
    setSelected(null);
    setTitle("");
    setDescription("");
    setCategory("Residential");
    setUrl("");
    setPublicId("");
    setMediaType("IMAGE");
    setOrder(0);
    setIsFeatured(false);
    setIsPublished(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelected(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setCategory(item.category || "Residential");
    setUrl(item.url || "");
    setPublicId(item.publicId || "");
    setMediaType(item.type || "IMAGE");
    setOrder(item.order || 0);
    setIsFeatured(item.isFeatured || false);
    setIsPublished(item.isPublished !== undefined ? item.isPublished : item.isActive);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!url) return toast.error("Media URL or file is required.");
    try {
      setLoading(true);
      const res = await saveGalleryItem({
        id: selected?.id,
        title,
        description,
        category,
        url,
        publicId,
        order: Number(order),
        isFeatured,
        isPublished,
        isActive: isPublished,
        type: mediaType,
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
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await deleteGalleryItem({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Gallery item deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <Button
              variant={categoryFilter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("ALL")}
            >
              All
            </Button>
            {GALLERY_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleOpenNew} className="font-semibold">
          <Plus className="mr-1.5 h-4 w-4" /> Add Gallery Item
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <Card key={item.id} className="relative overflow-hidden group border border-border bg-card flex flex-col justify-between">
            <div className="relative aspect-video w-full bg-muted overflow-hidden">
              {item.type === "VIDEO" ? (
                <video src={item.url} className="w-full h-full object-cover" muted loop autoPlay />
              ) : (
                item.url && <Image src={item.url} alt={item.title || "Gallery"} fill className="object-cover" unoptimized />
              )}
              {(!item.isPublished && !item.isActive) && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center">
                  <Badge variant="secondary">Draft / Hidden</Badge>
                </div>
              )}
              {item.isFeatured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-accent text-accent-foreground font-semibold">Featured</Badge>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-accent font-semibold tracking-wider uppercase">{item.category || "General"}</p>
                <h3 className="font-medium text-sm mt-1">{item.title || "Untitled Item"}</h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                )}
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
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Gallery Item" : "New Gallery Item"}</DialogTitle>
            <DialogDescription>Manage photo & video assets for Lumina Spaces gallery.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Media Type</Label>
                <Select value={mediaType} onValueChange={(val: any) => setMediaType(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMAGE">Image</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Media Upload / URL</Label>
              <MediaUploader value={url} onChange={(url, id) => { setUrl(url); if (id) setPublicId(id); }} onClear={() => { setUrl(""); setPublicId(""); }} />
            </div>

            <div className="space-y-2">
              <Label>Title (Optional)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Turnkey Office Reception" />
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter details about this item..." />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                <Label className="text-xs">Publish</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label className="text-xs">Featured</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Display Order</Label>
                <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-8 text-xs" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { MediaUploader } from "./media-uploader";
import { saveBeforeAfter, deleteBeforeAfter } from "@/actions/content.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  items: any[];
};

export function BeforeAfterManager({ items }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [beforeUrl, setBeforeUrl] = useState("");
  const [beforePublicId, setBeforePublicId] = useState("");
  const [afterUrl, setAfterUrl] = useState("");
  const [afterPublicId, setAfterPublicId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  const handleOpenNew = () => {
    setSelected(null);
    setTitle("");
    setCaption("");
    setBeforeUrl("");
    setBeforePublicId("");
    setAfterUrl("");
    setAfterPublicId("");
    setIsFeatured(false);
    setOrder(0);
    setIsOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelected(item);
    setTitle(item.title || "");
    setCaption(item.caption || "");
    setBeforeUrl(item.beforeUrl || "");
    setBeforePublicId(item.beforePublicId || "");
    setAfterUrl(item.afterUrl || "");
    setAfterPublicId(item.afterPublicId || "");
    setIsFeatured(item.isFeatured || false);
    setOrder(item.order || 0);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!title || !beforeUrl || !afterUrl) {
      return toast.error("Title, Before image, and After image are required.");
    }
    try {
      setLoading(true);
      const res = await saveBeforeAfter({
        id: selected?.id,
        title,
        caption,
        beforeUrl,
        beforePublicId,
        afterUrl,
        afterPublicId,
        isFeatured,
        order: Number(order),
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Comparison saved.");
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
      const res = await deleteBeforeAfter({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Comparison deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Search comparisons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
          <Plus className="mr-1.5 h-4 w-4" /> New Comparison
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="relative overflow-hidden bg-card border border-border">
            <CardContent className="space-y-3 p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative aspect-square w-full bg-muted rounded-md overflow-hidden">
                  {item.beforeUrl && <Image src={item.beforeUrl} alt="Before" fill className="object-cover" unoptimized />}
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">BEFORE</span>
                </div>
                <div className="relative aspect-square w-full bg-muted rounded-md overflow-hidden">
                  {item.afterUrl && <Image src={item.afterUrl} alt="After" fill className="object-cover" unoptimized />}
                  <span className="absolute bottom-1 left-1 bg-accent/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">AFTER</span>
                </div>
              </div>
              <div className="flex justify-between items-start gap-2 pt-1">
                <div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  {item.isFeatured && (
                    <Badge variant="accent" className="mt-1 gap-1 text-[10px]">
                      <Star className="h-3 w-3 fill-white" /> Featured
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-background max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Comparison" : "New Comparison"}</DialogTitle>
            <DialogDescription>Interactive before/after transformations manager.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Comparison Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Master Bedroom Renovation" />
            </div>
            <div className="space-y-2">
              <Label>Caption / Details (Optional)</Label>
              <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Before Image</Label>
                <MediaUploader value={beforeUrl} onChange={(url, id) => { setBeforeUrl(url); if (id) setBeforePublicId(id); }} onClear={() => { setBeforeUrl(""); setBeforePublicId(""); }} />
              </div>
              <div className="space-y-2">
                <Label>After Image</Label>
                <MediaUploader value={afterUrl} onChange={(url, id) => { setAfterUrl(url); if (id) setAfterPublicId(id); }} onClear={() => { setAfterUrl(""); setAfterPublicId(""); }} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label>Featured comparison on homepage</Label>
              </div>
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

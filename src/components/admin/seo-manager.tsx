"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaUploader } from "./media-uploader";
import { saveSeoMeta, deleteSeoMeta } from "@/actions/seo.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  overrides: any[];
};

export function SeoManager({ overrides }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [path, setPath] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [canonical, setCanonical] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [robots, setRobots] = useState("index,follow");

  const handleOpenNew = () => {
    setSelected(null);
    setPath("");
    setTitle("");
    setDescription("");
    setCanonical("");
    setOgTitle("");
    setOgDescription("");
    setOgImageUrl("");
    setTwitterCard("summary_large_image");
    setRobots("index,follow");
    setIsOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelected(item);
    setPath(item.path || "");
    setTitle(item.title || "");
    setDescription(item.description || "");
    setCanonical(item.canonical || "");
    setOgTitle(item.ogTitle || "");
    setOgDescription(item.ogDescription || "");
    setOgImageUrl(item.ogImageUrl || "");
    setTwitterCard(item.twitterCard || "summary_large_image");
    setRobots(item.robots || "index,follow");
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!path) return toast.error("Path is required.");
    try {
      setLoading(true);
      const res = await saveSeoMeta({
        id: selected?.id,
        path,
        title,
        description,
        canonical,
        ogTitle,
        ogDescription,
        ogImageUrl,
        twitterCard,
        robots,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("SEO override saved.");
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
      const res = await deleteSeoMeta({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("SEO override deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const filtered = overrides.filter((o) =>
    o.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Filter by path or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
          <Plus className="mr-1.5 h-4 w-4" /> Add Override
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>Meta Title</TableHead>
              <TableHead>Robots</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs font-semibold text-accent">{o.path}</TableCell>
                <TableCell className="text-muted-foreground">{o.title ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{o.robots ?? "index,follow"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(o)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(o.id)}><Trash className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-background max-h-[85vh] overflow-y-auto font-sans">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit SEO Override" : "Add SEO Override"}</DialogTitle>
            <DialogDescription>Define page metadata for crawlers, social share cards and canonicals.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Page Path</Label>
                <Input value={path} onChange={(e) => setPath(e.target.value)} placeholder="e.g. /about" disabled={!!selected} />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="e.g. https://lumina.co/about" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Robots Rules</Label>
                <Input value={robots} onChange={(e) => setRobots(e.target.value)} placeholder="index,follow" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-sm mb-3">Open Graph (Social Sharing)</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>OG Title</Label>
                    <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="Title when shared" />
                  </div>
                  <div className="space-y-2">
                    <Label>OG Description</Label>
                    <Textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter Card Style</Label>
                    <Select value={twitterCard} onValueChange={setTwitterCard}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary Icon</SelectItem>
                        <SelectItem value="summary_large_image">Large Image Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>OG Image (1200x630px recommended)</Label>
                  <MediaUploader value={ogImageUrl} onChange={(url) => setOgImageUrl(url)} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="gap-1.5 bg-[#b08d57] text-white hover:bg-[#b08d57]/90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveTestimonial, deleteTestimonial } from "@/actions/content.actions";
import { MediaUploader } from "./media-uploader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  testimonials: any[];
};

export function TestimonialsManager({ testimonials }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [clientName, setClientName] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPublicId, setPhotoPublicId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPublicId, setVideoPublicId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [order, setOrder] = useState(0);

  const handleOpenNew = () => {
    setSelected(null);
    setClientName("");
    setCompany("");
    setLocation("");
    setRating(5);
    setQuote("");
    setPhotoUrl("");
    setPhotoPublicId("");
    setVideoUrl("");
    setVideoPublicId("");
    setIsFeatured(false);
    setIsPublished(true);
    setOrder(0);
    setIsOpen(true);
  };

  const handleOpenEdit = (t: any) => {
    setSelected(t);
    setClientName(t.clientName || "");
    setCompany(t.company || "");
    setLocation(t.location || "");
    setRating(t.rating || 5);
    setQuote(t.quote || "");
    setPhotoUrl(t.photoUrl || "");
    setPhotoPublicId(t.photoPublicId || "");
    setVideoUrl(t.videoUrl || "");
    setVideoPublicId(t.videoPublicId || "");
    setIsFeatured(t.isFeatured || false);
    setIsPublished(t.isPublished);
    setOrder(t.order || 0);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!clientName || !quote) return toast.error("Client name and quote are required.");
    try {
      setLoading(true);
      const res = await saveTestimonial({
        id: selected?.id,
        clientName,
        company,
        location,
        rating,
        quote,
        photoUrl,
        photoPublicId,
        videoUrl,
        videoPublicId,
        isFeatured,
        isPublished,
        order: Number(order),
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Testimonial saved successfully.");
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
      const res = await deleteTestimonial({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Testimonial deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const filtered = testimonials.filter((t) =>
    t.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Search testimonials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
          <Plus className="mr-1.5 h-4 w-4" /> New Testimonial
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.clientName}</TableCell>
                <TableCell className="text-muted-foreground">{t.company ?? "—"}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {t.rating}
                  </span>
                </TableCell>
                <TableCell>{t.isFeatured ? "Yes" : "—"}</TableCell>
                <TableCell>
                  <Badge variant={t.isPublished ? "success" : "secondary"}>
                    {t.isPublished ? "Published" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(t)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(t.id)}><Trash className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-background max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
            <DialogDescription>Review details and testimonials from homeowners & business owners.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Company / Designation</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. CEO at GrowthBridge" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. New Delhi" />
              </div>
              <div className="space-y-2">
                <Label>Rating (Stars)</Label>
                <Select value={String(rating)} onValueChange={(val) => setRating(Number(val))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Client Quote</Label>
              <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-6 pt-8">
                <div className="flex items-center gap-2">
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                  <Label>Published</Label>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <MediaUploader value={photoUrl} onChange={(url, id) => { setPhotoUrl(url); if (id) setPhotoPublicId(id); }} onClear={() => { setPhotoUrl(""); setPhotoPublicId(""); }} />
              </div>
              <div className="space-y-2">
                <Label>Video Testimonial (Optional)</Label>
                <MediaUploader value={videoUrl} accept="video/*" onChange={(url, id) => { setVideoUrl(url); if (id) setVideoPublicId(id); }} onClear={() => { setVideoUrl(""); setVideoPublicId(""); }} />
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

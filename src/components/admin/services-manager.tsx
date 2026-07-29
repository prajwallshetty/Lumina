"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, HelpCircle, Wrench, Sparkles, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { saveService, deleteService } from "@/actions/service.actions";
import { MediaUploader } from "./media-uploader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  services: any[];
  faqCategories: any[];
};

export function ServicesManager({ services, faqCategories }: Props) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [overview, setOverview] = useState("");
  const [icon, setIcon] = useState("");
  const [heroMediaUrl, setHeroMediaUrl] = useState("");
  const [heroMediaPublicId, setHeroMediaPublicId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [order, setOrder] = useState(0);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Relational arrays state
  const [benefits, setBenefits] = useState<any[]>([]);
  const [processSteps, setProcessSteps] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  const handleOpenNew = () => {
    setSelectedService(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setOverview("");
    setIcon("Wrench");
    setHeroMediaUrl("");
    setHeroMediaPublicId("");
    setIsFeatured(false);
    setIsPublished(true);
    setOrder(0);
    setMetaTitle("");
    setMetaDescription("");
    setBenefits([]);
    setProcessSteps([]);
    setFaqs([]);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = async (s: any) => {
    setSelectedService(s);
    setTitle(s.title || "");
    setSlug(s.slug || "");
    setExcerpt(s.excerpt || "");
    setOverview(s.overview || "");
    setIcon(s.icon || "Wrench");
    setHeroMediaUrl(s.heroMediaUrl || "");
    setHeroMediaPublicId(s.heroMediaPublicId || "");
    setIsFeatured(s.isFeatured || false);
    setIsPublished(s.isPublished || false);
    setOrder(s.order || 0);
    setMetaTitle(s.metaTitle || "");
    setMetaDescription(s.metaDescription || "");
    
    // Set relations directly (ensure they are arrays)
    setBenefits(s.benefits || []);
    setProcessSteps(s.processSteps || []);
    setFaqs(s.faqs || []);
    setIsDialogOpen(true);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "", body: "", icon: "Sparkles", order: benefits.length }]);
  };

  const handleAddProcess = () => {
    setProcessSteps([...processSteps, { step: processSteps.length + 1, title: "", body: "" }]);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", categoryId: faqCategories[0]?.id || null, order: faqs.length, isPublished: true }]);
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast.error("Title and slug are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await saveService({
        id: selectedService?.id,
        title,
        slug,
        excerpt,
        overview,
        icon,
        heroMediaUrl,
        heroMediaPublicId,
        isFeatured,
        isPublished,
        order: Number(order),
        metaTitle,
        metaDescription,
        benefits,
        processSteps,
        faqs,
      });

      if (!res.ok) throw new Error(res.error);

      toast.success(selectedService ? "Service updated." : "Service created.");
      setIsDialogOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await deleteService({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Service deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete.");
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
          <Plus className="mr-1.5 h-4 w-4" /> New Service
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell className="text-muted-foreground">/{s.slug}</TableCell>
                <TableCell>{s.isFeatured ? "Yes" : "—"}</TableCell>
                <TableCell>
                  <Badge variant={s.isPublished ? "success" : "secondary"}>
                    {s.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(s.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>{selectedService ? "Edit Service" : "New Service"}</DialogTitle>
            <DialogDescription>Add or update Lumina design services here.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!selectedService) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} placeholder="e.g. Turnkey Interior Delivery" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. turnkey-delivery" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="A short description for grids and listings" />
            </div>
            <div className="space-y-2">
              <Label>Overview</Label>
              <Textarea value={overview} onChange={(e) => setOverview(e.target.value)} rows={4} placeholder="Full description / detailed text" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Icon Name (Lucide)</Label>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Wrench, Paintbrush, etc." />
              </div>
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
            <div className="space-y-2">
              <Label>Hero Banner Image</Label>
              <MediaUploader value={heroMediaUrl} onChange={(url, id) => { setHeroMediaUrl(url); if (id) setHeroMediaPublicId(id); }} onClear={() => { setHeroMediaUrl(""); setHeroMediaPublicId(""); }} />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
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

function Loader2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

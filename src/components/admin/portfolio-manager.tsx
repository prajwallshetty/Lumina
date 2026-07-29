"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, Trash2, Milestone, FileImage, Sparkles, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveProject, deleteProject, saveProjectCategory, deleteProjectCategory } from "@/actions/portfolio.actions";
import { MediaUploader } from "./media-uploader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils";

type Props = {
  projects: any[];
  categories: any[];
  designers: any[];
};

export function PortfolioManager({ projects, categories, designers }: Props) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Category State
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [client, setClient] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [area, setArea] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverMediaUrl, setCoverMediaUrl] = useState("");
  const [coverMediaPublicId, setCoverMediaPublicId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPublicId, setVideoPublicId] = useState("");
  const [designerId, setDesignerId] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [completionDate, setCompletionDate] = useState("");
  const [servicesUsedInput, setServicesUsedInput] = useState("");

  // Relational lists
  const [images, setImages] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [beforeAfters, setBeforeAfters] = useState<any[]>([]);

  const handleOpenNew = () => {
    setSelectedProject(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setDescription("");
    setCategoryId(categories[0]?.id || "");
    setClient("");
    setLocation("");
    setBudget("");
    setTimeline("");
    setArea("");
    setYear(new Date().getFullYear().toString());
    setStatus("DRAFT");
    setIsFeatured(false);
    setCoverMediaUrl("");
    setCoverMediaPublicId("");
    setVideoUrl("");
    setVideoPublicId("");
    setDesignerId("");
    setTagsInput("");
    setMetaTitle("");
    setMetaDescription("");
    setOrder(0);
    setCompletionDate("");
    setServicesUsedInput("");
    setImages([]);
    setMaterials([]);
    setBeforeAfters([]);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setSelectedProject(p);
    setTitle(p.title || "");
    setSlug(p.slug || "");
    setSummary(p.summary || "");
    setDescription(p.description || "");
    setCategoryId(p.categoryId || "");
    setClient(p.client || "");
    setLocation(p.location || "");
    setBudget(p.budget || "");
    setTimeline(p.timeline || "");
    setArea(p.area || "");
    setYear(p.year || "");
    setStatus(p.status || "DRAFT");
    setIsFeatured(p.isFeatured || false);
    setCoverMediaUrl(p.coverMediaUrl || "");
    setCoverMediaPublicId(p.coverMediaPublicId || "");
    setVideoUrl(p.videoUrl || "");
    setVideoPublicId(p.videoPublicId || "");
    setDesignerId(p.designerId || "");
    setTagsInput(p.tags?.join(", ") || "");
    setMetaTitle(p.metaTitle || "");
    setMetaDescription(p.metaDescription || "");
    setOrder(p.order || 0);
    setCompletionDate(p.completionDate || "");
    setServicesUsedInput(p.servicesUsed?.join(", ") || "");
    setImages(p.images || []);
    setMaterials(p.materials || []);
    setBeforeAfters(p.beforeAfters || []);
    setIsDialogOpen(true);
  };

  const handleAddImage = () => {
    setImages([...images, { url: "", publicId: "", alt: "", order: images.length }]);
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: "", detail: "" }]);
  };

  const handleAddBeforeAfter = () => {
    setBeforeAfters([...beforeAfters, { title: "", caption: "", beforeUrl: "", beforePublicId: "", afterUrl: "", afterPublicId: "", isFeatured: false, order: beforeAfters.length }]);
  };

  const handleSaveCategory = async () => {
    if (!newCatName || !newCatSlug) return toast.error("Category name and slug required.");
    try {
      const res = await saveProjectCategory({ name: newCatName, slug: newCatSlug, order: 0 });
      if (!res.ok) throw new Error(res.error);
      toast.success("Category created.");
      setNewCatName("");
      setNewCatSlug("");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will uncategorise related projects.")) return;
    try {
      const res = await deleteProjectCategory({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Category deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleSave = async () => {
    if (!title || !slug) return toast.error("Title and slug are required.");
    try {
      setLoading(true);
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const servicesUsed = servicesUsedInput.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await saveProject({
        id: selectedProject?.id,
        title,
        slug,
        summary,
        description,
        categoryId: categoryId || null,
        client,
        location,
        budget,
        timeline,
        area,
        year,
        completionDate,
        status: status as any,
        isFeatured,
        coverMediaUrl,
        coverMediaPublicId,
        videoUrl,
        videoPublicId,
        designerId: designerId || null,
        tags,
        servicesUsed,
        metaTitle,
        metaDescription,
        order: Number(order),
        images,
        materials,
        beforeAfters,
      });

      if (!res.ok) throw new Error(res.error);

      toast.success(selectedProject ? "Project saved." : "Project created.");
      setIsDialogOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await deleteProject({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Deleted successfully.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <FolderPlus className="mr-1.5 h-4 w-4" /> Categories
          </Button>
          <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
            <Plus className="mr-1.5 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground">{p.category?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={p.status === "PUBLISHED" ? "success" : "secondary"}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>{p.isFeatured ? "Yes" : "—"}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(p.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Category Editor Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Project Categories</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input placeholder="Category Name" value={newCatName} onChange={(e) => { setNewCatName(e.target.value); setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} />
              <Input placeholder="slug" value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} />
              <Button onClick={handleSaveCategory}>Add</Button>
            </div>
            <div className="divide-y divide-border border rounded-md">
              {categories.map((c) => (
                <div key={c.id} className="flex justify-between items-center p-3">
                  <span className="text-sm font-medium">{c.name} <span className="text-xs text-muted-foreground">({c._count?.projects ?? 0})</span></span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCategory(c.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Project Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>{selectedProject ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription>Add or update portfolio details, gallery images and materials.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid grid-cols-7 w-full bg-secondary">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="beforeafter">BeforeAfter</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!selectedProject) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} placeholder="e.g. The Ivory Villa" />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Designer/Staff</Label>
                  <Select value={designerId} onValueChange={setDesignerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Designer" />
                    </SelectTrigger>
                    <SelectContent>
                      {designers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                  <Label>Featured Project</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Input value={client} onChange={(e) => setClient(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $150K" />
                </div>
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. 6 Months" />
                </div>
                <div className="space-y-2">
                  <Label>Area (Sq Ft)</Label>
                  <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 3,500 sq ft" />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Completion Date</Label>
                  <Input value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} placeholder="e.g. October 2025" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags (Comma-separated)</Label>
                <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. Luxury, Modern, Minimal" />
              </div>
              <div className="space-y-2">
                <Label>Services Used (Comma-separated)</Label>
                <Input value={servicesUsedInput} onChange={(e) => setServicesUsedInput(e.target.value)} placeholder="e.g. Turnkey Interiors, Space Planning" />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <MediaUploader value={coverMediaUrl} onChange={(url, id) => { setCoverMediaUrl(url); if (id) setCoverMediaPublicId(id); }} onClear={() => { setCoverMediaUrl(""); setCoverMediaPublicId(""); }} />
                </div>
                <div className="space-y-2">
                  <Label>Project Showcase Video (MP4)</Label>
                  <MediaUploader value={videoUrl} accept="video/*" onChange={(url, id) => { setVideoUrl(url); if (id) setVideoPublicId(id); }} onClear={() => { setVideoUrl(""); setVideoPublicId(""); }} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Gallery Images</Label>
                <Button type="button" size="sm" onClick={handleAddImage}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Image
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((img, i) => (
                  <div key={i} className="relative border border-border p-4 rounded-lg bg-card">
                    <button type="button" className="absolute top-2 right-2 text-destructive" onClick={() => setImages(images.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Label className="text-xs mb-2 block">Upload Image</Label>
                    <MediaUploader value={img.url} onChange={(url, id) => {
                      const copy = [...images];
                      copy[i].url = url;
                      if (id) copy[i].publicId = id;
                      setImages(copy);
                    }} />
                    <div className="mt-2 space-y-2">
                      <Input placeholder="Image Alt Text" value={img.alt || ""} onChange={(e) => {
                        const copy = [...images];
                        copy[i].alt = e.target.value;
                        setImages(copy);
                      }} />
                      <Input type="number" placeholder="Order" value={img.order} onChange={(e) => {
                        const copy = [...images];
                        copy[i].order = Number(e.target.value);
                        setImages(copy);
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Materials List</Label>
                <Button type="button" size="sm" onClick={handleAddMaterial}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Material
                </Button>
              </div>
              {materials.map((m, i) => (
                <div key={i} className="flex gap-4 items-end border border-border p-4 rounded-lg bg-card">
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">Material Name</Label>
                      <Input value={m.name} onChange={(e) => {
                        const copy = [...materials];
                        copy[i].name = e.target.value;
                        setMaterials(copy);
                      }} placeholder="e.g. Natural Travertine" />
                    </div>
                    <div>
                      <Label className="text-xs">Detail / Finish</Label>
                      <Input value={m.detail || ""} onChange={(e) => {
                        const copy = [...materials];
                        copy[i].detail = e.target.value;
                        setMaterials(copy);
                      }} placeholder="e.g. Honed finish, 20mm slab" />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setMaterials(materials.filter((_, idx) => idx !== i))}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="beforeafter" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Before & After Slider Transformations</Label>
                <Button type="button" size="sm" onClick={handleAddBeforeAfter}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Slide
                </Button>
              </div>
              {beforeAfters.map((ba, i) => (
                <div key={i} className="border border-border p-4 rounded-lg bg-card space-y-4 relative">
                  <button type="button" className="absolute top-4 right-4 text-destructive" onClick={() => setBeforeAfters(beforeAfters.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">Transformation Title</Label>
                      <Input value={ba.title} onChange={(e) => {
                        const copy = [...beforeAfters];
                        copy[i].title = e.target.value;
                        setBeforeAfters(copy);
                      }} placeholder="Living Room Concept" />
                    </div>
                    <div>
                      <Label className="text-xs">Caption/Notes</Label>
                      <Input value={ba.caption || ""} onChange={(e) => {
                        const copy = [...beforeAfters];
                        copy[i].caption = e.target.value;
                        setBeforeAfters(copy);
                      }} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">Before Image (Original / Sketch)</Label>
                      <MediaUploader value={ba.beforeUrl} onChange={(url, id) => {
                        const copy = [...beforeAfters];
                        copy[i].beforeUrl = url;
                        if (id) copy[i].beforePublicId = id;
                        setBeforeAfters(copy);
                      }} />
                    </div>
                    <div>
                      <Label className="text-xs">After Image (Render / Complete)</Label>
                      <MediaUploader value={ba.afterUrl} onChange={(url, id) => {
                        const copy = [...beforeAfters];
                        copy[i].afterUrl = url;
                        if (id) copy[i].afterPublicId = id;
                        setBeforeAfters(copy);
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} />
              </div>
            </TabsContent>
          </Tabs>

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

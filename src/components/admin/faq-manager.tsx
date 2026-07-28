"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, FolderPlus, Loader2 } from "lucide-react";
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
import { saveFaq, deleteFaq, saveFaqCategory, deleteFaqCategory } from "@/actions/content.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  faqs: any[];
  categories: any[];
  services: any[];
};

export function FaqManager({ faqs, categories, services }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Category Add states
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");

  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [order, setOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const handleOpenNew = () => {
    setSelected(null);
    setQuestion("");
    setAnswer("");
    setCategoryId(categories[0]?.id || "");
    setServiceId("global");
    setOrder(0);
    setIsPublished(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (faq: any) => {
    setSelected(faq);
    setQuestion(faq.question || "");
    setAnswer(faq.answer || "");
    setCategoryId(faq.categoryId || "");
    setServiceId(faq.serviceId || "global");
    setOrder(faq.order || 0);
    setIsPublished(faq.isPublished);
    setIsOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!newCatName || !newCatSlug) return toast.error("Category name and slug are required.");
    try {
      const res = await saveFaqCategory({ name: newCatName, slug: newCatSlug, order: 0 });
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
    if (!confirm("Are you sure? FAQ items in this category will be uncategorized.")) return;
    try {
      const res = await deleteFaqCategory({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Category deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleSave = async () => {
    if (!question || !answer) return toast.error("Question and Answer are required.");
    try {
      setLoading(true);
      const res = await saveFaq({
        id: selected?.id,
        question,
        answer,
        categoryId: categoryId || null,
        serviceId: serviceId === "global" ? null : serviceId,
        order: Number(order),
        isPublished,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("FAQ saved.");
      setIsOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteFaq({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("FAQ deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const filtered = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (faq.answer || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <FolderPlus className="mr-1.5 h-4 w-4" /> Categories
          </Button>
          <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
            <Plus className="mr-1.5 h-4 w-4" /> New FAQ
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-md truncate font-medium">{faq.question}</TableCell>
                <TableCell className="text-muted-foreground">{faq.category?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{faq.service?.title ?? "Global"}</TableCell>
                <TableCell>
                  <Badge variant={faq.isPublished ? "success" : "secondary"}>
                    {faq.isPublished ? "Published" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(faq)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(faq.id)}><Trash className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Categories dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md bg-background font-sans">
          <DialogHeader>
            <DialogTitle>FAQ Categories</DialogTitle>
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
                  <span className="text-sm font-medium">{c.name}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCategory(c.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main FAQ editor dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl bg-background max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit FAQ" : "New FAQ"}</DialogTitle>
            <DialogDescription>Add or update frequently asked questions.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What is your design process?" />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} placeholder="Detailed answer..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
                <Label>Scope (Service Bound)</Label>
                <Select value={serviceId} onValueChange={setServiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Global" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global FAQ</SelectItem>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                    ))}
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
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                <Label>Published (Visible on FAQ page)</Label>
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

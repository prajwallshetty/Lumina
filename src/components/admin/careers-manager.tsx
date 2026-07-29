"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, Loader2 } from "lucide-react";
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
import { saveJobPosting, deleteJobPosting } from "@/actions/content.actions";
import { RichTextEditor } from "./rich-text-editor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  jobs: any[];
};

export function CareersManager({ jobs }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("FULL_TIME");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isOpenPosition, setIsOpenPosition] = useState(true);

  const handleOpenNew = () => {
    setSelected(null);
    setTitle("");
    setSlug("");
    setDepartment("");
    setLocation("");
    setType("FULL_TIME");
    setDescription("");
    setRequirements("");
    setIsOpenPosition(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (job: any) => {
    setSelected(job);
    setTitle(job.title || "");
    setSlug(job.slug || "");
    setDepartment(job.department || "");
    setLocation(job.location || "");
    setType(job.type || "FULL_TIME");
    setDescription(job.description || "");
    setRequirements(job.requirements || "");
    setIsOpenPosition(job.isOpen);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!title || !slug) return toast.error("Title and slug are required.");
    try {
      setLoading(true);
      const res = await saveJobPosting({
        id: selected?.id,
        title,
        slug,
        department,
        location,
        type: type as any,
        description,
        requirements,
        isOpen: isOpenPosition,
        isPublished: true,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Job posting saved successfully.");
      setIsOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete this job and related applications.")) return;
    try {
      const res = await deleteJobPosting({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Job posting deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.department || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Search postings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
          <Plus className="mr-1.5 h-4 w-4" /> New Posting
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell className="text-muted-foreground">{job.department ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{job.type}</TableCell>
                <TableCell>{job._count?.applications ?? 0}</TableCell>
                <TableCell>
                  <Badge variant={job.isOpen ? "success" : "secondary"}>
                    {job.isOpen ? "Open" : "Closed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(job)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(job.id)}><Trash className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-background max-h-[85vh] overflow-y-auto font-sans">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Job Posting" : "New Job Posting"}</DialogTitle>
            <DialogDescription>Create openings to attract elite design talent to Lumina.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!selected) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} placeholder="e.g. Lead Interior Architect" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Design" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. New Delhi" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description / Overview</Label>
              <RichTextEditor value={description} onChange={setDescription} placeholder="About the role..." />
            </div>
            <div className="space-y-2">
              <Label>Requirements (Optional)</Label>
              <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3} placeholder="Skills, years of experience, tools..." />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Switch checked={isOpenPosition} onCheckedChange={setIsOpenPosition} />
              <Label>Position Open (Allow applications)</Label>
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

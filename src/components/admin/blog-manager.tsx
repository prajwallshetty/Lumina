"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, FolderPlus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { savePost, deletePost, saveBlogCategory, deleteBlogCategory, saveBlogTag, deleteBlogTag } from "@/actions/blog.actions";
import { MediaUploader } from "./media-uploader";
import { RichTextEditor } from "./rich-text-editor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils";

type Props = {
  posts: any[];
  categories: any[];
  tags: any[];
  authors: any[];
};

const STATUS_VARIANT = { PUBLISHED: "success", DRAFT: "secondary", SCHEDULED: "warning" } as const;

export function BlogManager({ posts, categories, tags, authors }: Props) {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Category & Tag Dialog form states
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagSlug, setNewTagSlug] = useState("");

  // Post form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [publishedAt, setPublishedAt] = useState("");
  const [readingTime, setReadingTime] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const handleOpenNew = () => {
    setSelectedPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverUrl("");
    setCoverPublicId("");
    setStatus("DRAFT");
    setPublishedAt(new Date().toISOString().substring(0, 16));
    setReadingTime("");
    setCategoryId(categories[0]?.id || "");
    setAuthorId(authors[0]?.id || "");
    setMetaTitle("");
    setMetaDescription("");
    setSelectedTagIds([]);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setSelectedPost(p);
    setTitle(p.title || "");
    setSlug(p.slug || "");
    setExcerpt(p.excerpt || "");
    setContent(p.content || "");
    setCoverUrl(p.coverUrl || "");
    setCoverPublicId(p.coverPublicId || "");
    setStatus(p.status || "DRAFT");
    setPublishedAt(p.publishedAt ? new Date(p.publishedAt).toISOString().substring(0, 16) : "");
    setReadingTime(p.readingTime || "");
    setCategoryId(p.categoryId || "");
    setAuthorId(p.authorId || "");
    setMetaTitle(p.metaTitle || "");
    setMetaDescription(p.metaDescription || "");
    
    // Tag IDs mapping
    const tagIds = p.tags?.map((t: any) => t.tagId || t.tag?.id) || [];
    setSelectedTagIds(tagIds);
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!newCatName || !newCatSlug) return toast.error("Required fields missing.");
    try {
      const res = await saveBlogCategory({ name: newCatName, slug: newCatSlug });
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
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteBlogCategory({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Category deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleSaveTag = async () => {
    if (!newTagName || !newTagSlug) return toast.error("Required fields missing.");
    try {
      const res = await saveBlogTag({ name: newTagName, slug: newTagSlug });
      if (!res.ok) throw new Error(res.error);
      toast.success("Tag created.");
      setNewTagName("");
      setNewTagSlug("");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteBlogTag({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Tag deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleSave = async () => {
    if (!title || !slug) return toast.error("Title and slug are required.");
    try {
      setLoading(true);
      const res = await savePost({
        id: selectedPost?.id,
        title,
        slug,
        excerpt,
        content,
        coverUrl,
        coverPublicId,
        status: status as any,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        readingTime: readingTime === "" ? null : Number(readingTime),
        categoryId: categoryId || null,
        authorId: authorId || null,
        metaTitle,
        metaDescription,
        tagIds: selectedTagIds,
      });

      if (!res.ok) throw new Error(res.error);

      toast.success(selectedPost ? "Post updated." : "Post created.");
      setIsDialogOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await deletePost({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Post deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete.");
    }
  };

  const toggleTag = (id: string) => {
    if (selectedTagIds.includes(id)) {
      setSelectedTagIds(selectedTagIds.filter((tId) => tId !== id));
    } else {
      setSelectedTagIds([...selectedTagIds, id]);
    }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <FolderPlus className="mr-1.5 h-4 w-4" /> Categories
          </Button>
          <Button variant="outline" onClick={() => setIsTagDialogOpen(true)}>
            <Tags className="mr-1.5 h-4 w-4" /> Tags
          </Button>
          <Button variant="accent" onClick={handleOpenNew} className="font-semibold">
            <Plus className="mr-1.5 h-4 w-4" /> New Post
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="text-muted-foreground">{post.category?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{post.author?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[post.status as keyof typeof STATUS_VARIANT]}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(post.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(post.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Categories dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Blog Categories</DialogTitle>
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

      {/* Tags dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Blog Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input placeholder="Tag Name" value={newTagName} onChange={(e) => { setNewTagName(e.target.value); setNewTagSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} />
              <Input placeholder="slug" value={newTagSlug} onChange={(e) => setNewTagSlug(e.target.value)} />
              <Button onClick={handleSaveTag}>Add</Button>
            </div>
            <div className="divide-y divide-border border rounded-md">
              {tags.map((t) => (
                <div key={t.id} className="flex justify-between items-center p-3">
                  <span className="text-sm font-medium">#{t.name}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteTag(t.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>{selectedPost ? "Edit Blog Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid grid-cols-5 w-full bg-secondary">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Cover Image</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!selectedPost) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} placeholder="e.g. Design Trends in 2026" />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Brief summary of the article..." />
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
                  <Label>Author</Label>
                  <Select value={authorId} onValueChange={setAuthorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
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
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Publish Date/Time</Label>
                  <Input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Reading Time (Minutes, optional)</Label>
                  <Input type="number" value={readingTime} onChange={(e) => setReadingTime(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Leave blank to auto-calculate" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 pt-4">
              <Label>Article body</Label>
              <RichTextEditor value={content} onChange={setContent} placeholder="Write your post content here..." />
            </TabsContent>

            <TabsContent value="media" className="space-y-4 pt-4">
              <Label>Cover image</Label>
              <MediaUploader value={coverUrl} onChange={(url, id) => { setCoverUrl(url); if (id) setCoverPublicId(id); }} onClear={() => { setCoverUrl(""); setCoverPublicId(""); }} />
            </TabsContent>

            <TabsContent value="tags" className="space-y-4 pt-4">
              <Label className="text-sm font-semibold">Select Tags</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border p-4 rounded-lg bg-card max-h-[300px] overflow-y-auto">
                {tags.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <Checkbox id={`tag-${t.id}`} checked={selectedTagIds.includes(t.id)} onCheckedChange={() => toggleTag(t.id)} />
                    <Label htmlFor={`tag-${t.id}`} className="cursor-pointer font-normal">#{t.name}</Label>
                  </div>
                ))}
              </div>
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

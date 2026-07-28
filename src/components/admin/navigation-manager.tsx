"use client";

import { useState } from "react";
import { Plus, Pencil, Trash, Save, Share2, Compass, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveNavItem, deleteNavItem, saveSocialLink, deleteSocialLink } from "@/actions/navigation.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  initialNavItems: any[];
  initialSocialLinks: any[];
  allNavItems: any[];
};

export function NavigationManager({ initialNavItems, initialSocialLinks, allNavItems }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("header");
  const [loading, setLoading] = useState(false);

  // Link Dialog states
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [linkLocation, setLinkLocation] = useState("HEADER");
  const [linkGroup, setLinkGroup] = useState("");
  const [linkParentId, setLinkParentId] = useState("");
  const [linkOrder, setLinkOrder] = useState(0);
  const [linkActive, setLinkActive] = useState(true);

  // Social Dialog states
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<any | null>(null);
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialOrder, setSocialOrder] = useState(0);
  const [socialActive, setSocialActive] = useState(true);

  // Filter items by location
  const headerLinks = allNavItems.filter((i) => i.location === "HEADER");
  const footerLinks = allNavItems.filter((i) => i.location === "FOOTER");

  const handleOpenNewLink = (loc: string) => {
    setSelectedLink(null);
    setLinkLabel("");
    setLinkHref("");
    setLinkLocation(loc);
    setLinkGroup("");
    setLinkParentId("");
    setLinkOrder(allNavItems.length);
    setLinkActive(true);
    setIsLinkOpen(true);
  };

  const handleOpenEditLink = (item: any) => {
    setSelectedLink(item);
    setLinkLabel(item.label || "");
    setLinkHref(item.href || "");
    setLinkLocation(item.location || "HEADER");
    setLinkGroup(item.group || "");
    setLinkParentId(item.parentId || "");
    setLinkOrder(item.order || 0);
    setLinkActive(item.isActive);
    setIsLinkOpen(true);
  };

  const handleSaveLink = async () => {
    if (!linkLabel || !linkHref) return toast.error("Label and URL are required.");
    try {
      setLoading(true);
      const res = await saveNavItem({
        id: selectedLink?.id,
        label: linkLabel,
        href: linkHref,
        location: linkLocation as any,
        group: linkGroup || null,
        parentId: linkParentId || null,
        order: Number(linkOrder),
        isActive: linkActive,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Navigation link saved.");
      setIsLinkOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure? Sub-items will also be deleted.")) return;
    try {
      const res = await deleteNavItem({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Link deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  // Socials Handlers
  const handleOpenNewSocial = () => {
    setSelectedSocial(null);
    setSocialPlatform("");
    setSocialUrl("");
    setSocialOrder(initialSocialLinks.length);
    setSocialActive(true);
    setIsSocialOpen(true);
  };

  const handleOpenEditSocial = (s: any) => {
    setSelectedSocial(s);
    setSocialPlatform(s.platform || "");
    setSocialUrl(s.url || "");
    setSocialOrder(s.order || 0);
    setSocialActive(s.isActive);
    setIsSocialOpen(true);
  };

  const handleSaveSocial = async () => {
    if (!socialPlatform || !socialUrl) return toast.error("Platform and URL required.");
    try {
      setLoading(true);
      const res = await saveSocialLink({
        id: selectedSocial?.id,
        platform: socialPlatform,
        url: socialUrl,
        order: Number(socialOrder),
        isActive: socialActive,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Social link saved.");
      setIsSocialOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteSocialLink({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Social link deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="header" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full bg-secondary">
          <TabsTrigger value="header">Header Menu</TabsTrigger>
          <TabsTrigger value="footer">Footer Columns</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Main Navigation capsule links</Label>
            <Button size="sm" onClick={() => handleOpenNewLink("HEADER")}><Plus className="mr-1.5 h-4 w-4" /> Add Header Link</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Path / URL</TableHead>
                  <TableHead>Parent Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {headerLinks.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold">{item.label}</TableCell>
                    <TableCell className="font-mono text-xs">{item.href}</TableCell>
                    <TableCell className="text-muted-foreground">{allNavItems.find(p => p.id === item.parentId)?.label ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "success" : "secondary"}>{item.isActive ? "Active" : "Disabled"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditLink(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteLink(item.id)}><Trash className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Footer Directory Link lists</Label>
            <Button size="sm" onClick={() => handleOpenNewLink("FOOTER")}><Plus className="mr-1.5 h-4 w-4" /> Add Footer Link</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heading / Group</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Path / URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {footerLinks.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-accent">{item.group ?? "General"}</TableCell>
                    <TableCell className="font-semibold">{item.label}</TableCell>
                    <TableCell className="font-mono text-xs">{item.href}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "success" : "secondary"}>{item.isActive ? "Active" : "Disabled"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditLink(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteLink(item.id)}><Trash className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Social Media Handles</Label>
            <Button size="sm" onClick={handleOpenNewSocial}><Plus className="mr-1.5 h-4 w-4" /> Add Social Link</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Profile URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialSocialLinks.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold">{s.platform}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{s.url}</TableCell>
                    <TableCell>
                      <Badge variant={s.isActive ? "success" : "secondary"}>{s.isActive ? "Active" : "Disabled"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditSocial(s)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteSocial(s.id)}><Trash className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Link modal */}
      <Dialog open={isLinkOpen} onOpenChange={setIsLinkOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>{selectedLink ? "Edit Navigation Link" : "Add Navigation Link"}</DialogTitle>
            <DialogDescription>Add header pages or footer columns dynamically.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Link Text (Label)</Label>
              <Input value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} placeholder="e.g. Services" />
            </div>
            <div className="space-y-2">
              <Label>Href (Link Destination)</Label>
              <Input value={linkHref} onChange={(e) => setLinkHref(e.target.value)} placeholder="e.g. /services" />
            </div>
            {linkLocation === "HEADER" ? (
              <div className="space-y-2">
                <Label>Parent Link (Dropdown menu, optional)</Label>
                <Select value={linkParentId} onValueChange={setLinkParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No Parent (Top Level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Top Level)</SelectItem>
                    {headerLinks.filter(l => l.id !== selectedLink?.id && !l.parentId).map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Footer Group Heading</Label>
                <Input value={linkGroup} onChange={(e) => setLinkGroup(e.target.value)} placeholder="e.g. Services, Company, Explore" />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={linkOrder} onChange={(e) => setLinkOrder(Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch checked={linkActive} onCheckedChange={setLinkActive} />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLink} disabled={loading}>
              {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Social modal */}
      <Dialog open={isSocialOpen} onOpenChange={setIsSocialOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>{selectedSocial ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Platform Name</Label>
              <Input value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} placeholder="e.g. Instagram" />
            </div>
            <div className="space-y-2">
              <Label>Profile URL</Label>
              <Input value={socialUrl} onChange={(e) => setSocialUrl(e.target.value)} placeholder="https://instagram.com/lumina" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={socialOrder} onChange={(e) => setSocialOrder(Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch checked={socialActive} onCheckedChange={setSocialActive} />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSocialOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSocial} disabled={loading}>
              {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Save Social Handle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

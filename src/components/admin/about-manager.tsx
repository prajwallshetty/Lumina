"use client";

import { useState } from "react";
import { Plus, Trash, Save, Pencil, Loader2, Sparkles, Trophy, CalendarDays, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { MediaUploader } from "./media-uploader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  updateAboutContent,
  saveTimelineEvent,
  deleteTimelineEvent,
  saveTeamMember,
  deleteTeamMember,
  saveCertificate,
  deleteCertificate,
} from "@/actions/content.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  content: any;
  timeline: any[];
  team: any[];
  certificates: any[];
};

export function AboutManager({ content, timeline, team, certificates }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State - Content
  const [storyTitle, setStoryTitle] = useState(content.storyTitle || "");
  const [storyBody, setStoryBody] = useState(content.storyBody || "");
  const [mission, setMission] = useState(content.mission || "");
  const [vision, setVision] = useState(content.vision || "");
  const [founderName, setFounderName] = useState(content.founderName || "");
  const [founderRole, setFounderRole] = useState(content.founderRole || "");
  const [founderMessage, setFounderMessage] = useState(content.founderMessage || "");
  const [founderPhotoUrl, setFounderPhotoUrl] = useState(content.founderPhotoUrl || "");
  const [founderPhotoPublicId, setFounderPhotoPublicId] = useState(content.founderPhotoPublicId || "");
  const [officePhotoUrl, setOfficePhotoUrl] = useState(content.officePhotoUrl || "");
  const [officePhotoPublicId, setOfficePhotoPublicId] = useState(content.officePhotoPublicId || "");

  // Dialog management
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<any | null>(null);
  const [timelineYear, setTimelineYear] = useState("");
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineBody, setTimelineBody] = useState("");

  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [teamPhotoUrl, setTeamPhotoUrl] = useState("");
  const [teamPhotoPublicId, setTeamPhotoPublicId] = useState("");
  const [teamLinkedin, setTeamLinkedin] = useState("");
  const [teamActive, setTeamActive] = useState(true);

  const [isCertOpen, setIsCertOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certYear, setCertYear] = useState("");
  const [certImageUrl, setCertImageUrl] = useState("");
  const [certImagePublicId, setCertImagePublicId] = useState("");

  const handleSaveAbout = async () => {
    try {
      setLoading(true);
      const res = await updateAboutContent({
        storyTitle,
        storyBody,
        mission,
        vision,
        founderName,
        founderRole,
        founderMessage,
        founderPhotoUrl,
        founderPhotoPublicId,
        officePhotoUrl,
        officePhotoPublicId,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("About page content saved.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setLoading(false);
    }
  };

  // Timeline Event Handlers
  const handleOpenNewTimeline = () => {
    setSelectedTimeline(null);
    setTimelineYear("");
    setTimelineTitle("");
    setTimelineBody("");
    setIsTimelineOpen(true);
  };

  const handleOpenEditTimeline = (ev: any) => {
    setSelectedTimeline(ev);
    setTimelineYear(ev.year || "");
    setTimelineTitle(ev.title || "");
    setTimelineBody(ev.body || "");
    setIsTimelineOpen(true);
  };

  const handleSaveTimeline = async () => {
    if (!timelineYear || !timelineTitle) return toast.error("Year and Title required.");
    try {
      const res = await saveTimelineEvent({
        id: selectedTimeline?.id,
        year: timelineYear,
        title: timelineTitle,
        body: timelineBody,
        order: timeline.length,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Timeline event saved.");
      setIsTimelineOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteTimelineEvent({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Event deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  // Team Member Handlers
  const handleOpenNewTeam = () => {
    setSelectedTeam(null);
    setTeamName("");
    setTeamRole("");
    setTeamBio("");
    setTeamPhotoUrl("");
    setTeamPhotoPublicId("");
    setTeamLinkedin("");
    setTeamActive(true);
    setIsTeamOpen(true);
  };

  const handleOpenEditTeam = (tm: any) => {
    setSelectedTeam(tm);
    setTeamName(tm.name || "");
    setTeamRole(tm.role || "");
    setTeamBio(tm.bio || "");
    setTeamPhotoUrl(tm.photoUrl || "");
    setTeamPhotoPublicId(tm.photoPublicId || "");
    setTeamLinkedin(tm.linkedinUrl || "");
    setTeamActive(tm.isActive);
    setIsTeamOpen(true);
  };

  const handleSaveTeam = async () => {
    if (!teamName || !teamRole) return toast.error("Name and Role required.");
    try {
      const res = await saveTeamMember({
        id: selectedTeam?.id,
        name: teamName,
        role: teamRole,
        bio: teamBio,
        photoUrl: teamPhotoUrl,
        photoPublicId: teamPhotoPublicId,
        linkedinUrl: teamLinkedin,
        isActive: teamActive,
        order: team.length,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Team member saved.");
      setIsTeamOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteTeamMember({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Team member deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  // Certificate Handlers
  const handleOpenNewCert = () => {
    setSelectedCert(null);
    setCertTitle("");
    setCertIssuer("");
    setCertYear("");
    setCertImageUrl("");
    setCertImagePublicId("");
    setIsCertOpen(true);
  };

  const handleOpenEditCert = (cert: any) => {
    setSelectedCert(cert);
    setCertTitle(cert.title || "");
    setCertIssuer(cert.issuer || "");
    setCertYear(cert.year || "");
    setCertImageUrl(cert.imageUrl || "");
    setCertImagePublicId(cert.imagePublicId || "");
    setIsCertOpen(true);
  };

  const handleSaveCert = async () => {
    if (!certTitle) return toast.error("Title is required.");
    try {
      const res = await saveCertificate({
        id: selectedCert?.id,
        title: certTitle,
        issuer: certIssuer,
        year: certYear,
        imageUrl: certImageUrl,
        imagePublicId: certImagePublicId,
        order: certificates.length,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Certificate saved.");
      setIsCertOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteCertificate({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Certificate deleted.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSaveAbout} disabled={loading} className="bg-[#b08d57] text-white hover:bg-[#b08d57]/90 font-semibold gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save About Settings
        </Button>
      </div>

      <Tabs defaultValue="story" className="w-full">
        <TabsList className="grid grid-cols-5 w-full bg-secondary">
          <TabsTrigger value="story">Story & Values</TabsTrigger>
          <TabsTrigger value="founder">Founder</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Story & Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Story Title</Label>
                <Input value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Story Body</Label>
                <Textarea value={storyBody} onChange={(e) => setStoryBody(e.target.value)} rows={4} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Mission Statement</Label>
                  <Textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Vision Statement</Label>
                  <Textarea value={vision} onChange={(e) => setVision(e.target.value)} rows={3} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="founder" className="space-y-4 pt-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
            <Card>
              <CardHeader>
                <CardTitle>Founder Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Founder Name</Label>
                    <Input value={founderName} onChange={(e) => setFounderName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Founder Role</Label>
                    <Input value={founderRole} onChange={(e) => setFounderRole(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea value={founderMessage} onChange={(e) => setFounderMessage(e.target.value)} rows={5} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Founder Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaUploader
                  value={founderPhotoUrl}
                  onChange={(url, id) => {
                    setFounderPhotoUrl(url);
                    if (id) setFounderPhotoPublicId(id);
                  }}
                  onClear={() => {
                    setFounderPhotoUrl("");
                    setFounderPhotoPublicId("");
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Timeline Milestones</Label>
            <Button size="sm" onClick={handleOpenNewTimeline}><Plus className="mr-1 h-4 w-4" /> Add Event</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeline.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-bold text-accent">{event.year}</TableCell>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-xs">{event.body}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditTimeline(event)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteTimeline(event.id)}><Trash className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Team Directory</Label>
            <Button size="sm" onClick={handleOpenNewTeam}><Plus className="mr-1 h-4 w-4" /> Add Member</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.role}</TableCell>
                    <TableCell>
                      <Badge variant={member.isActive ? "success" : "secondary"}>
                        {member.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditTeam(member)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteTeam(member.id)}><Trash className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Certifications & Awards</Label>
            <Button size="sm" onClick={handleOpenNewCert}><Plus className="mr-1 h-4 w-4" /> Add Certificate</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Award / Certificate</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.title}</TableCell>
                    <TableCell className="text-muted-foreground">{cert.issuer ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{cert.year ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditCert(cert)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCert(cert.id)}><Trash className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Timeline Editor Modal */}
      <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>{selectedTimeline ? "Edit Timeline Event" : "New Timeline Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Year</Label>
              <Input placeholder="e.g. 2024" value={timelineYear} onChange={(e) => setTimelineYear(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g. Studio Foundation" value={timelineTitle} onChange={(e) => setTimelineTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Details..." value={timelineBody} onChange={(e) => setTimelineBody(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTimelineOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTimeline}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Member Editor Modal */}
      <Dialog open={isTeamOpen} onOpenChange={setIsTeamOpen}>
        <DialogContent className="max-w-lg bg-background max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTeam ? "Edit Team Member" : "New Team Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={teamRole} onChange={(e) => setTeamRole(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio / Excerpt</Label>
              <Textarea value={teamBio} onChange={(e) => setTeamBio(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn Profile URL</Label>
              <Input value={teamLinkedin} onChange={(e) => setTeamLinkedin(e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2 py-2">
              <Switch checked={teamActive} onCheckedChange={setTeamActive} />
              <Label>Active Staff Member</Label>
            </div>
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <MediaUploader value={teamPhotoUrl} onChange={(url, id) => { setTeamPhotoUrl(url); if (id) setTeamPhotoPublicId(id); }} onClear={() => { setTeamPhotoUrl(""); setTeamPhotoPublicId(""); }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeamOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTeam}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Editor Modal */}
      <Dialog open={isCertOpen} onOpenChange={setIsCertOpen}>
        <DialogContent className="max-w-md bg-background max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCert ? "Edit Certification / Award" : "New Certification / Award"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Award / Certificate Title</Label>
              <Input value={certTitle} onChange={(e) => setCertTitle(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="e.g. AD India" />
              </div>
              <div className="space-y-2">
                <Label>Year Received</Label>
                <Input value={certYear} onChange={(e) => setCertYear(e.target.value)} placeholder="e.g. 2025" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Certificate Image / Logo</Label>
              <MediaUploader value={certImageUrl} onChange={(url, id) => { setCertImageUrl(url); if (id) setCertImagePublicId(id); }} onClear={() => { setCertImageUrl(""); setCertImagePublicId(""); }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCertOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCert}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

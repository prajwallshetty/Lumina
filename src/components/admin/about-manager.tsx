"use client";

import { useState } from "react";
import { Save, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploader } from "./media-uploader";
import { updateAboutContent } from "@/actions/content.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  content: any;
};

export function AboutManager({ content }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State - Content
  const [storyTitle, setStoryTitle] = useState(content?.storyTitle || "");
  const [storyBody, setStoryBody] = useState(content?.storyBody || "");
  const [experienceText, setExperienceText] = useState(content?.experienceText || "");
  const [yearsOfExperienceCount, setYearsOfExperienceCount] = useState(content?.yearsOfExperienceCount || "");
  const [completedProjectsCount, setCompletedProjectsCount] = useState(content?.completedProjectsCount || "");
  const [clientSatisfactionCount, setClientSatisfactionCount] = useState(content?.clientSatisfactionCount || "");

  const [visionTitle, setVisionTitle] = useState(content?.visionTitle || "");
  const [vision, setVision] = useState(content?.vision || "");
  const [missionTitle, setMissionTitle] = useState(content?.missionTitle || "");
  const [mission, setMission] = useState(content?.mission || "");

  const [founderName, setFounderName] = useState(content?.founderName || "");
  const [founderRole, setFounderRole] = useState(content?.founderRole || "");
  const [founderMessage, setFounderMessage] = useState(content?.founderMessage || "");
  const [founderPhotoUrl, setFounderPhotoUrl] = useState(content?.founderPhotoUrl || "");
  const [founderPhotoPublicId, setFounderPhotoPublicId] = useState(content?.founderPhotoPublicId || "");

  const [officePhotoUrl, setOfficePhotoUrl] = useState(content?.officePhotoUrl || "");
  const [officePhotoPublicId, setOfficePhotoPublicId] = useState(content?.officePhotoPublicId || "");

  const handleSaveAbout = async () => {
    try {
      setLoading(true);
      const res = await updateAboutContent({
        storyTitle,
        storyBody,
        experienceText,
        yearsOfExperienceCount,
        completedProjectsCount,
        clientSatisfactionCount,
        visionTitle,
        vision,
        missionTitle,
        mission,
        founderName,
        founderRole,
        founderMessage,
        founderPhotoUrl,
        founderPhotoPublicId,
        officePhotoUrl,
        officePhotoPublicId,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("About page content saved successfully.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to update About content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" /> Company Story & Overview
          </CardTitle>
          <Button onClick={handleSaveAbout} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Page Main Title</Label>
              <Input
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="ABOUT LUMINA SPACES"
              />
            </div>
            <div className="space-y-2">
              <Label>Experience Tag / Subtitle</Label>
              <Input
                value={experienceText}
                onChange={(e) => setExperienceText(e.target.value)}
                placeholder="Since 2017"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Company Overview / Description</Label>
            <Textarea
              rows={5}
              value={storyBody}
              onChange={(e) => setStoryBody(e.target.value)}
              placeholder="With 8+ years of industry experience, Lumina Spaces..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-2">
              <Label>Years of Experience Count</Label>
              <Input
                value={yearsOfExperienceCount}
                onChange={(e) => setYearsOfExperienceCount(e.target.value)}
                placeholder="8+"
              />
            </div>
            <div className="space-y-2">
              <Label>Completed Projects Count</Label>
              <Input
                value={completedProjectsCount}
                onChange={(e) => setCompletedProjectsCount(e.target.value)}
                placeholder="500+"
              />
            </div>
            <div className="space-y-2">
              <Label>Client Satisfaction Rate</Label>
              <Input
                value={clientSatisfactionCount}
                onChange={(e) => setClientSatisfactionCount(e.target.value)}
                placeholder="99%"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vision & Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vision Section Title</Label>
              <Input
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                placeholder="Our Vision"
              />
            </div>
            <div className="space-y-2">
              <Label>Mission Section Title</Label>
              <Input
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="Our Mission"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vision Description</Label>
              <Textarea
                rows={6}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="To be a trusted leader..."
              />
            </div>
            <div className="space-y-2">
              <Label>Mission Description (Supports Bullets)</Label>
              <Textarea
                rows={6}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="• To deliver premium residential..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Founder Message & Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Founder Name</Label>
              <Input
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="Founder Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Founder Designation / Role</Label>
              <Input
                value={founderRole}
                onChange={(e) => setFounderRole(e.target.value)}
                placeholder="Principal Architect & Founder"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Founder Message</Label>
            <Textarea
              rows={4}
              value={founderMessage}
              onChange={(e) => setFounderMessage(e.target.value)}
              placeholder="Message from the founder..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Label>Founder Photo</Label>
              <MediaUploader
                value={founderPhotoUrl}
                onChange={(url, publicId) => {
                  setFounderPhotoUrl(url);
                  setFounderPhotoPublicId(publicId || "");
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Office / Studio Photo</Label>
              <MediaUploader
                value={officePhotoUrl}
                onChange={(url, publicId) => {
                  setOfficePhotoUrl(url);
                  setOfficePhotoPublicId(publicId || "");
                }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveAbout} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save All Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

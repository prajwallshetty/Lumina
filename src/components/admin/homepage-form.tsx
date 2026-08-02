"use client";

import { useState } from "react";
import { Plus, Trash, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaUploader } from "./media-uploader";
import { updateHomepageContent, saveStat, deleteStat } from "@/actions/content.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  home: any;
};

export function HomepageForm({ home }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [heroEyebrow, setHeroEyebrow] = useState(home.heroEyebrow || "");
  const [heroTitle, setHeroTitle] = useState(home.heroTitle || "");
  const [heroSubtitle, setHeroSubtitle] = useState(home.heroSubtitle || "");
  const [heroPrimaryCtaLabel, setHeroPrimaryCtaLabel] = useState(home.heroPrimaryCtaLabel || "");
  const [heroPrimaryCtaHref, setHeroPrimaryCtaHref] = useState(home.heroPrimaryCtaHref || "");
  const [heroSecondaryCtaLabel, setHeroSecondaryCtaLabel] = useState(home.heroSecondaryCtaLabel || "");
  const [heroSecondaryCtaHref, setHeroSecondaryCtaHref] = useState(home.heroSecondaryCtaHref || "");
  const [heroMediaUrl, setHeroMediaUrl] = useState(home.heroMediaUrl || "");
  const [heroMediaPublicId, setHeroMediaPublicId] = useState(home.heroMediaPublicId || "");
  const [heroMediaType, setHeroMediaType] = useState(home.heroMediaType || "IMAGE");

  const [heroVideos, setHeroVideos] = useState<string[]>(
    home.heroMediaType === "VIDEO" && home.heroMediaUrl
      ? home.heroMediaUrl.split(",").filter(Boolean)
      : []
  );

  const handleAddHeroVideo = (url: string) => {
    const updated = [...heroVideos, url];
    setHeroVideos(updated);
    setHeroMediaUrl(updated.join(","));
  };

  const handleRemoveHeroVideo = (index: number) => {
    const updated = heroVideos.filter((_, idx) => idx !== index);
    setHeroVideos(updated);
    setHeroMediaUrl(updated.join(","));
  };

  // Section Visibilities
  const [showStats, setShowStats] = useState(home.showStats);
  const [showAboutPreview, setShowAboutPreview] = useState(home.showAboutPreview);
  const [showServices, setShowServices] = useState(home.showServices);
  const [showProcess, setShowProcess] = useState(home.showProcess);
  const [showFeatured, setShowFeatured] = useState(home.showFeatured);
  const [showBeforeAfter, setShowBeforeAfter] = useState(home.showBeforeAfter);
  const [showTestimonials, setShowTestimonials] = useState(home.showTestimonials);
  const [showReviews, setShowReviews] = useState(home.showReviews);
  const [showBrands, setShowBrands] = useState(home.showBrands);
  const [showBlog, setShowBlog] = useState(home.showBlog);
  const [showFaqs, setShowFaqs] = useState(home.showFaqs);

  // Stats List State
  const [stats, setStats] = useState<any[]>(home.stats || []);
  const [newStatLabel, setNewStatLabel] = useState("");
  const [newStatValue, setNewStatValue] = useState("");

  const handleSaveContent = async () => {
    try {
      setLoading(true);
      const res = await updateHomepageContent({
        heroEyebrow,
        heroTitle,
        heroSubtitle,
        heroPrimaryCtaLabel,
        heroPrimaryCtaHref,
        heroSecondaryCtaLabel,
        heroSecondaryCtaHref,
        heroMediaUrl,
        heroMediaPublicId,
        heroMediaType: heroMediaType as any,
        showStats,
        showAboutPreview,
        showServices,
        showProcess,
        showFeatured,
        showBeforeAfter,
        showTestimonials,
        showReviews,
        showBrands,
        showBlog,
        showFaqs,
      });

      if (!res.ok) throw new Error(res.error);
      toast.success("Homepage content saved.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStat = async () => {
    if (!newStatLabel || !newStatValue) return toast.error("Label and Value are required.");
    try {
      const res = await saveStat({
        label: newStatLabel,
        value: newStatValue,
        order: stats.length,
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Stat added.");
      setNewStatLabel("");
      setNewStatValue("");
      router.refresh();
      setStats([...stats, res.data]);
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteStat({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Stat deleted.");
      setStats(stats.filter((s) => s.id !== id));
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSaveContent} disabled={loading} className="bg-[#b08d57] text-white hover:bg-[#b08d57]/90 font-semibold gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Homepage Settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Eyebrow</Label>
                <Input value={heroEyebrow} onChange={(e) => setHeroEyebrow(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary CTA Label</Label>
                  <Input value={heroPrimaryCtaLabel} onChange={(e) => setHeroPrimaryCtaLabel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Primary CTA Link (Href)</Label>
                  <Input value={heroPrimaryCtaHref} onChange={(e) => setHeroPrimaryCtaHref(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA Label</Label>
                  <Input value={heroSecondaryCtaLabel} onChange={(e) => setHeroSecondaryCtaLabel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA Link (Href)</Label>
                  <Input value={heroSecondaryCtaHref} onChange={(e) => setHeroSecondaryCtaHref(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Media Type</Label>
                <Select value={heroMediaType} onValueChange={(val) => {
                  setHeroMediaType(val);
                  if (val === "IMAGE") {
                    setHeroMediaUrl(heroVideos[0] || "");
                  } else {
                    setHeroMediaUrl(heroVideos.join(","));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMAGE">Image</SelectItem>
                    <SelectItem value="VIDEO">Video (MP4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {heroMediaType === "VIDEO" ? (
                <div className="space-y-4">
                  <Label>Hero Videos</Label>
                  <div className="space-y-2">
                    {heroVideos.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg bg-secondary/10">
                        <video src={url} className="h-10 w-16 object-cover rounded bg-black" muted />
                        <span className="text-xs truncate flex-1 font-mono text-muted-foreground">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveHeroVideo(idx)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs text-muted-foreground">Add another video</Label>
                    <MediaUploader
                      value=""
                      accept="video/*"
                      onChange={(url) => {
                        if (url) handleAddHeroVideo(url);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>File Upload</Label>
                  <MediaUploader
                    value={heroMediaUrl}
                    accept="image/*"
                    onChange={(url, id) => {
                      setHeroMediaUrl(url);
                      if (id) setHeroMediaPublicId(id);
                    }}
                    onClear={() => {
                      setHeroMediaUrl("");
                      setHeroMediaPublicId("");
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VisibilityRow label="Statistics Banner" value={showStats} onChange={setShowStats} />
              <VisibilityRow label="About Preview" value={showAboutPreview} onChange={setShowAboutPreview} />
              <VisibilityRow label="Services Grid" value={showServices} onChange={setShowServices} />
              <VisibilityRow label="Methodology / Process" value={showProcess} onChange={setShowProcess} />
              <VisibilityRow label="Featured Projects" value={showFeatured} onChange={setShowFeatured} />
              <VisibilityRow label="Before & After Slider" value={showBeforeAfter} onChange={setShowBeforeAfter} />
              <VisibilityRow label="Client Testimonials" value={showTestimonials} onChange={setShowTestimonials} />
              <VisibilityRow label="Web Reviews" value={showReviews} onChange={setShowReviews} />
              <VisibilityRow label="Brand Logos" value={showBrands} onChange={setShowBrands} />
              <VisibilityRow label="Blog Preview Grid" value={showBlog} onChange={setShowBlog} />
              <VisibilityRow label="FAQs Accordion" value={showFaqs} onChange={setShowFaqs} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Homepage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="12 Yrs" value={newStatValue} onChange={(e) => setNewStatValue(e.target.value)} />
                <Input placeholder="Experience" value={newStatLabel} onChange={(e) => setNewStatLabel(e.target.value)} />
                <Button onClick={handleAddStat} size="sm">Add</Button>
              </div>
              <div className="divide-y divide-border border rounded-md">
                {stats.map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-3">
                    <div>
                      <span className="text-sm font-bold text-accent mr-2">{s.value}</span>
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteStat(s.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function VisibilityRow({ label, value, onChange }: { label: string; value: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border last:border-0">
      <Label className="text-sm font-normal text-muted-foreground">{label}</Label>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

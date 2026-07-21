import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FieldPreview } from "@/components/admin/field-preview";
import { MediaContainer } from "@/components/shared/media-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHomepageContent } from "@/services/homepage.service";

export const metadata: Metadata = { title: "Homepage CMS" };

export default async function AdminHomepagePage() {
  const home = await getHomepageContent();

  const sections: [string, boolean][] = [
    ["Statistics", home.showStats],
    ["About preview", home.showAboutPreview],
    ["Services", home.showServices],
    ["Process", home.showProcess],
    ["Featured projects", home.showFeatured],
    ["Before & After", home.showBeforeAfter],
    ["Testimonials", home.showTestimonials],
    ["Reviews", home.showReviews],
    ["Brands", home.showBrands],
    ["Blog", home.showBlog],
    ["FAQs", home.showFaqs],
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Homepage" description="Hero content, media and section visibility." />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardHeader>
            <CardTitle>Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldPreview label="Eyebrow" value={home.heroEyebrow} />
            <FieldPreview label="Title" value={home.heroTitle} />
            <FieldPreview label="Subtitle" value={home.heroSubtitle} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldPreview label="Primary CTA" value={home.heroPrimaryCtaLabel} />
              <FieldPreview label="Secondary CTA" value={home.heroSecondaryCtaLabel} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero media</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaContainer src={home.heroMediaUrl} label="Hero media" aspect="aspect-[4/5]" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section visibility</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {sections.map(([label, on]) => (
            <Badge key={label} variant={on ? "success" : "secondary"}>
              {label}: {on ? "On" : "Off"}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

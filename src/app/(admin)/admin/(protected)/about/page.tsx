import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FieldPreview } from "@/components/admin/field-preview";
import { MediaContainer } from "@/components/shared/media-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAboutContent } from "@/services/content.service";

export const metadata: Metadata = { title: "About CMS" };

export default async function AdminAboutPage() {
  const { content, timeline, team, certificates } = await getAboutContent();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="About" description="Story, mission, founder, team, timeline and certificates." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Story & values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldPreview label="Story title" value={content.storyTitle} />
            <FieldPreview label="Story" value={content.storyBody} />
            <FieldPreview label="Mission" value={content.mission} />
            <FieldPreview label="Vision" value={content.vision} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Founder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MediaContainer src={content.founderPhotoUrl} label="Founder photo" aspect="aspect-[4/3]" />
            <FieldPreview label="Name" value={content.founderName} />
            <FieldPreview label="Role" value={content.founderRole} />
            <FieldPreview label="Message" value={content.founderMessage} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Timeline events", timeline.length],
          ["Team members", team.length],
          ["Certificates", certificates.length],
        ].map(([label, count]) => (
          <Card key={label as string}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-heading text-3xl font-semibold">{count as number}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

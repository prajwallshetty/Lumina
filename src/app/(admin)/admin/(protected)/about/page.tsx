import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AboutManager } from "@/components/admin/about-manager";
import { getAboutContent } from "@/services/content.service";

export const metadata: Metadata = { title: "About CMS" };

export default async function AdminAboutPage() {
  const { content, timeline, team, certificates } = await getAboutContent();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="About" description="Story, mission, founder, team, timeline and certificates." />
      <AboutManager content={content} timeline={timeline} team={team} certificates={certificates} />
    </div>
  );
}

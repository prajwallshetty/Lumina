import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AboutManager } from "@/components/admin/about-manager";
import { getAboutContent } from "@/services/content.service";

export const metadata: Metadata = { title: "About CMS" };

export default async function AdminAboutPage() {
  const { content } = await getAboutContent();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="About" description="Manage company story, experience, vision, mission and founder message." />
      <AboutManager content={content} />
    </div>
  );
}

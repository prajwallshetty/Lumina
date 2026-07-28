import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { HomepageForm } from "@/components/admin/homepage-form";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Homepage CMS" };

export default async function AdminHomepagePage() {
  const home = await db.homepageContent.findUnique({
    where: { id: "singleton" },
    include: {
      stats: { orderBy: { order: "asc" } },
    },
  });

  if (!home) return <p className="text-destructive">Homepage content data not found.</p>;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Homepage" description="Hero content, media and section visibility." />
      <HomepageForm home={home} />
    </div>
  );
}

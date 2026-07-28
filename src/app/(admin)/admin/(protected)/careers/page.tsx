import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { CareersManager } from "@/components/admin/careers-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Careers" };

export default async function AdminCareersPage() {
  const jobs = await db.jobPosting.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Careers"
        description="Manage open positions and view applications."
      />
      <CareersManager jobs={jobs} />
    </div>
  );
}

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { BeforeAfterManager } from "@/components/admin/before-after-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Before & After" };

export default async function AdminBeforeAfterPage() {
  const items = await db.beforeAfter.findMany({ orderBy: { order: "asc" } }).catch(() => []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Before & After"
        description="Manage the interactive before/after comparisons shown on the site."
      />
      <BeforeAfterManager items={items} />
    </div>
  );
}

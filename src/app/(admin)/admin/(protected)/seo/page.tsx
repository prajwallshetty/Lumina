import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SeoManager } from "@/components/admin/seo-manager";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"]);
  const overrides = await db.seoMeta.findMany({ orderBy: { path: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="SEO"
        description="Per-path meta, Open Graph, Twitter cards, canonical, robots and structured data."
      />
      <SeoManager overrides={overrides} />
    </div>
  );
}

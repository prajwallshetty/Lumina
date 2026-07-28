import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { NewsletterManager } from "@/components/admin/newsletter-manager";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Newsletter Subscribers" };

export default async function AdminNewsletterPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const subscribers = await db.inquiry.findMany({
    where: { source: "FOOTER" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Newsletter Subscribers"
        description="View and export email addresses subscribed to the studio updates."
      />
      <NewsletterManager subscribers={subscribers} />
    </div>
  );
}

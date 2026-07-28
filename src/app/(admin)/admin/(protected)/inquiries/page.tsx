import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { InquiriesManager } from "@/components/admin/inquiries-manager";
import { requireRole } from "@/lib/session";
import { listInquiries, listAssignableStaff } from "@/services/crm.service";

export const metadata: Metadata = { title: "Inquiries" };

export default async function AdminInquiriesPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN", "SALES"]);
  const [inquiries, staff] = await Promise.all([
    listInquiries(),
    listAssignableStaff(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Inquiries" description="Every form submission from the website, with status and assignment." />
      <InquiriesManager inquiries={inquiries} staff={staff} />
    </div>
  );
}

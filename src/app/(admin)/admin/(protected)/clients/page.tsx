import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ClientsManager } from "@/components/admin/clients-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Clients | Admin" };

export default async function AdminClientsPage() {
  const clients = await db.brand.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Clients"
        description="Manage partner brands and client logos displayed across the website."
      />
      <ClientsManager clients={clients} />
    </div>
  );
}

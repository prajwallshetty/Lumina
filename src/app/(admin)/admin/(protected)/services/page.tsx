import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServicesManager } from "@/components/admin/services-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const [services, faqCategories] = await Promise.all([
    db.service.findMany({
      include: {
        benefits: { orderBy: { order: "asc" } },
        processSteps: { orderBy: { step: "asc" } },
        faqs: { orderBy: { order: "asc" } },
      },
      orderBy: { order: "asc" },
    }),
    db.faqCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services"
        description="Each service is its own page with overview, benefits, process and FAQs."
      />
      <ServicesManager services={services} faqCategories={faqCategories} />
    </div>
  );
}

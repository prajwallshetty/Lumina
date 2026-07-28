import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FaqManager } from "@/components/admin/faq-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  const [faqs, categories, services] = await Promise.all([
    db.faq.findMany({
      orderBy: { order: "asc" },
      include: { category: true, service: { select: { id: true, title: true } } },
    }),
    db.faqCategory.findMany({ orderBy: { order: "asc" } }),
    db.service.findMany({ select: { id: true, title: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQs"
        description="Global and per-service frequently asked questions."
      />
      <FaqManager faqs={faqs} categories={categories} services={services} />
    </div>
  );
}

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        description="Client quotes, ratings and video testimonials."
      />
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const [projects, categories, designers] = await Promise.all([
    db.project.findMany({
      orderBy: { order: "asc" },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        materials: true,
        beforeAfters: { orderBy: { order: "asc" } },
      },
    }),
    db.projectCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    }),
    db.user.findMany({
      where: { role: { not: "VIEWER" }, isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Portfolio"
        description="Manage projects, galleries, before/after and materials."
      />
      <PortfolioManager projects={projects} categories={categories} designers={designers} />
    </div>
  );
}

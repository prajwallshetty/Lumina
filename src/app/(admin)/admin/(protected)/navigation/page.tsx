import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { NavigationManager } from "@/components/admin/navigation-manager";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Navigation & Social Settings" };

export default async function AdminNavigationPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  const [navItems, socialLinks] = await Promise.all([
    db.navItem.findMany({
      orderBy: { order: "asc" },
      include: { children: { orderBy: { order: "asc" } } },
    }),
    db.socialLink.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  // Filter root items (no parentId)
  const rootNavItems = navItems.filter(item => !item.parentId);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Navigation & Social Menu"
        description="Edit links for the main navigation bar (header), footer columns, and social profiles."
      />
      <NavigationManager initialNavItems={rootNavItems} initialSocialLinks={socialLinks} allNavItems={navItems} />
    </div>
  );
}

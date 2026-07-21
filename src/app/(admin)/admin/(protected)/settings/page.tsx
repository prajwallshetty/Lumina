import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireRole } from "@/lib/session";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Settings" description="Company details, branding, integrations and maintenance mode." />
      <SettingsForm
        defaults={{
          companyName: settings.companyName,
          tagline: settings.tagline ?? "",
          email: settings.email ?? "",
          phone: settings.phone ?? "",
          whatsapp: settings.whatsapp ?? "",
          addressLine: settings.addressLine ?? "",
          city: settings.city ?? "",
          primaryColor: settings.primaryColor ?? "",
          accentColor: settings.accentColor ?? "",
          googleAnalyticsId: settings.googleAnalyticsId ?? "",
          metaPixelId: settings.metaPixelId ?? "",
        }}
        maintenance={{
          maintenanceMode: settings.maintenanceMode,
          maintenanceMessage: settings.maintenanceMessage ?? "",
        }}
      />
    </div>
  );
}

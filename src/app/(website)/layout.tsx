import { AppProviders } from "@/providers";
import { SiteHeader } from "@/components/website/site-header";
import { SiteFooter } from "@/components/website/site-footer";
import { WhatsAppButton } from "@/components/website/whatsapp-button";
import { isMaintenanceActive, getSiteSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/session";
import { MaintenanceScreen } from "@/components/website/maintenance-screen";

// Content is CMS-driven; render per request (pages can opt into ISR individually).
export const dynamic = "force-dynamic";

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  // Maintenance mode: admins bypass; everyone else sees the maintenance screen.
  const [maintenance, user, settings] = await Promise.all([
    isMaintenanceActive().catch(() => false),
    getCurrentUser().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  const isStaff = user && user.role !== "VIEWER";
  if (maintenance && !isStaff) {
    return (
      <AppProviders defaultTheme="light">
        <MaintenanceScreen
          message={settings?.maintenanceMessage}
          endsAt={settings?.maintenanceEndsAt ?? null}
        />
      </AppProviders>
    );
  }

  return (
    <AppProviders defaultTheme="light">
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppButton phone={settings?.whatsapp} />
      </div>
    </AppProviders>
  );
}

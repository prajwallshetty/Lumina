import { cache } from "react";
import { db } from "./db";

/** Load the singleton SiteSettings row, creating defaults on first read. */
export const getSiteSettings = cache(async () => {
  return db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
});

/** Whether the public site should show the maintenance screen. */
export async function isMaintenanceActive(): Promise<boolean> {
  const settings = await getSiteSettings().catch(() => null);
  if (!settings?.maintenanceMode) return false;
  if (settings.maintenanceEndsAt && settings.maintenanceEndsAt < new Date()) return false;
  return true;
}

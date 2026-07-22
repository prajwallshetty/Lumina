/**
 * Static, deploy-time site configuration. Dynamic, editable content lives in
 * the database (SiteSettings) — this holds only structural constants.
 */
export const siteConfig = {
  name: "Lumina Spaces",
  shortName: "Lumina",
  description:
    "Lumina Spaces is a full-service interior design studio crafting considered, timeless spaces for homes and workplaces.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

export type SiteConfig = typeof siteConfig;

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedProjectSlugs } from "@/services/portfolio.service";
import { getPublishedPostSlugs } from "@/services/blog.service";
import { getPublishedServices } from "@/services/services.service";

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/portfolio",
  "/before-after",
  "/gallery",
  "/testimonials",
  "/blog",
  "/faqs",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [projects, posts, services] = await Promise.all([
    getPublishedProjectSlugs().catch(() => []),
    getPublishedPostSlugs().catch(() => []),
    getPublishedServices().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...projectEntries, ...postEntries];
}

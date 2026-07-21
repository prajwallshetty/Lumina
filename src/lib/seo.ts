import type { Metadata } from "next";
import { db } from "./db";
import { env } from "./env";

const BASE_URL = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
};

/** Compose a Metadata object with sensible OG/Twitter defaults. */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, BASE_URL).toString();
  const siteName = env.NEXT_PUBLIC_SITE_NAME ?? "Lumina";
  const fullTitle = title ? `${title} — ${siteName}` : siteName;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/** Merge a DB SeoMeta override (if any) on top of defaults for a given path. */
export async function metadataForPath(
  path: string,
  fallback: BuildMetadataInput,
): Promise<Metadata> {
  const override = await db.seoMeta.findUnique({ where: { path } }).catch(() => null);
  return buildMetadata({
    title: override?.title ?? fallback.title,
    description: override?.description ?? fallback.description,
    path,
    image: override?.ogImageUrl ?? fallback.image,
    noIndex: override?.robots?.includes("noindex") ?? fallback.noIndex,
  });
}

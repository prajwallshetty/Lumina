import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getHomepageContent = cache(async () => {
  try {
    return await db.homepageContent.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
      include: { stats: { orderBy: { order: "asc" } } },
    });
  } catch {
    // Graceful fallback if database connection/seed is missing
    return {
      id: "singleton",
      heroEyebrow: "ARCHITECTURAL INTERIORS",
      heroTitle: "Designed Around Extraordinary Living",
      heroSubtitle: "We craft refined residential sanctuaries and architectural environments that blend quiet minimalism with sensory warmth.",
      heroPrimaryCtaLabel: "VIEW OUR PROJECTS",
      heroPrimaryCtaHref: "/portfolio",
      heroSecondaryCtaLabel: "PLAY SHOWREEL",
      heroSecondaryCtaHref: "/contact",
      heroMediaUrl: null,
      heroMediaPublicId: null,
      heroMediaType: "IMAGE" as const,
      showStats: true,
      showAboutPreview: true,
      showServices: true,
      showProcess: true,
      showFeatured: true,
      showBeforeAfter: true,
      showTestimonials: true,
      showReviews: true,
      showBrands: true,
      showBlog: true,
      showFaqs: true,
      stats: [],
    };
  }
});

import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export type FallbackBenefit = { id: string; order: number; title: string; icon: string | null; body: string | null; serviceId: string; description?: string | null };
export type FallbackStep = { id: string; step: number; title: string; body: string | null; serviceId: string; description?: string | null };
export type FallbackFaq = { id: string; question: string; answer: string; order: number; isPublished: boolean; serviceId: string };

export type FallbackService = {
  id: string;
  slug: string;
  title: string;
  order: number;
  isFeatured: boolean;
  isPublished: boolean;
  summary: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string | null;
  heroMediaUrl: string | null;
  overview: string | null;
  createdAt: Date;
  updatedAt: Date;
  benefits: FallbackBenefit[];
  processSteps: FallbackStep[];
  faqs: FallbackFaq[];
};

const FALLBACK_SERVICES: Record<string, FallbackService> = {
  "architectural-interiors": {
    id: "architectural-interiors",
    slug: "architectural-interiors",
    title: "Architectural Interior Design",
    order: 1,
    isFeatured: true,
    isPublished: true,
    summary: "Full-scale luxury interior architecture, space planning, and custom spatial design.",
    description: "We craft refined architectural interiors that integrate spatial harmony, natural lighting, and bespoke materiality. From concept sketches to final styling, every detail is engineered for sensory living.",
    metaTitle: "Architectural Interior Design | Lumina Spaces",
    metaDescription: "Full-scale luxury interior architecture and space planning.",
    excerpt: "Full-scale luxury interior architecture and space planning.",
    heroMediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    overview: "We craft refined architectural interiors that integrate spatial harmony, natural lighting, and bespoke materiality.",
    createdAt: new Date(),
    updatedAt: new Date(),
    benefits: [
      { id: "b1", order: 1, title: "Custom Millwork", icon: null, body: "Bespoke cabinetry, paneling, and architectural elements tailored to your lifestyle.", serviceId: "architectural-interiors" },
      { id: "b2", order: 2, title: "Lighting Design", icon: null, body: "Multi-layered architectural lighting systems creating calm ambient scenes.", serviceId: "architectural-interiors" },
    ],
    processSteps: [
      { id: "p1", step: 1, title: "Spatial Strategy & Concept", body: "Detailed 3D layout modeling and moodboard curation.", serviceId: "architectural-interiors" },
      { id: "p2", step: 2, title: "Material Selection", body: "Hand-selecting stone, wood, metals, and textiles.", serviceId: "architectural-interiors" },
      { id: "p3", step: 3, title: "Turnkey Execution", body: "On-site management and precision artisan installation.", serviceId: "architectural-interiors" },
    ],
    faqs: [],
  },
  "turnkey-execution": {
    id: "turnkey-execution",
    slug: "turnkey-execution",
    title: "Turnkey Execution & Fitouts",
    order: 2,
    isFeatured: true,
    isPublished: true,
    summary: "End-to-end project management, artisan construction, and precision interior fitting.",
    description: "Our turnkey execution service manages every trade, procurement milestone, and site engineering challenge with uncompromising standards.",
    metaTitle: "Turnkey Execution & Fitouts | Lumina Spaces",
    metaDescription: "End-to-end project management and interior fitting.",
    excerpt: "End-to-end project management and interior fitting.",
    heroMediaUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    overview: "Our turnkey execution service manages every trade, procurement milestone, and site engineering challenge.",
    createdAt: new Date(),
    updatedAt: new Date(),
    benefits: [],
    processSteps: [],
    faqs: [],
  },
};

export const getPublishedServices = cache(async () => {
  try {
    const services = await db.service.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
    if (services.length > 0) return services;
  } catch {
    // Graceful fallback
  }
  return Object.values(FALLBACK_SERVICES);
});

export const getFeaturedServices = cache(async (limit = 6) => {
  try {
    const services = await db.service.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { order: "asc" },
      take: limit,
    });
    if (services.length > 0) return services;
  } catch {
    // Graceful fallback
  }
  return Object.values(FALLBACK_SERVICES).slice(0, limit);
});

export const getServiceBySlug = cache(async (slug: string) => {
  try {
    const service = await db.service.findFirst({
      where: { slug, isPublished: true },
      include: {
        benefits: { orderBy: { order: "asc" } },
        processSteps: { orderBy: { step: "asc" } },
        faqs: { where: { isPublished: true }, orderBy: { order: "asc" } },
      },
    });
    if (service) return service;
  } catch {
    // Graceful fallback
  }

  if (FALLBACK_SERVICES[slug]) return FALLBACK_SERVICES[slug];

  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const genericFallback: FallbackService = {
    id: slug,
    slug,
    title: formattedTitle,
    order: 1,
    isFeatured: true,
    isPublished: true,
    summary: "Bespoke architectural service by Lumina Spaces.",
    description: "Crafted with precision, sensory warmth, and timeless craftsmanship.",
    metaTitle: `${formattedTitle} | Lumina Spaces`,
    metaDescription: "Bespoke architectural service by Lumina Spaces.",
    excerpt: "Bespoke architectural service by Lumina Spaces.",
    heroMediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    overview: "Crafted with precision, sensory warmth, and timeless craftsmanship.",
    createdAt: new Date(),
    updatedAt: new Date(),
    benefits: [],
    processSteps: [],
    faqs: [],
  };

  return genericFallback;
});

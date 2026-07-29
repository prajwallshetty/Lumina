import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export type FallbackProject = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  coverMediaUrl: string | null;
  location: string | null;
  client: string | null;
  year: string | null;
  area: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  isFeatured: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  categoryId?: string | null;
  category: { id: string; name: string; slug: string } | null;
  designer: { id: string; name: string; jobTitle: string | null; image: string | null } | null;
  images: Array<{ id: string; url: string | null; alt: string | null; media?: { secureUrl?: string | null } | null }>;
  materials: Array<{ id: string; name: string; detail: string | null }>;
  beforeAfters: Array<{ id: string; beforeUrl: string | null; afterUrl: string | null; title: string; caption?: string | null }>;
};

const FALLBACK_PROJECTS: Record<string, FallbackProject> = {
  "the-ivory-house": {
    id: "the-ivory-house",
    slug: "the-ivory-house",
    title: "Masco Grandeur",
    summary: "A serene, light-filled sanctuary crafted with ivory plaster, natural travertine, and warm timber accents in Bengaluru.",
    description: "Designed for quiet introspection, Masco Grandeur blends sculptural geometry with tactile natural materials. Large floor-to-ceiling openings connect interior living zones with lush courtyard gardens, creating a seamless dialogue between built environment and nature.",
    coverMediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    location: "Bengaluru, India",
    client: "Private Residence",
    year: "2025",
    area: "6,500 sq.ft",
    budget: "Confidential",
    timeline: "14 Months",
    status: "PUBLISHED",
    isFeatured: true,
    category: { id: "cat-1", name: "Residential", slug: "residential" },
    designer: { id: "d-1", name: "Lumina Design Studio", jobTitle: "Principal Architects", image: null },
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop", alt: "Living Space" },
      { id: "img-2", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop", alt: "Master Suite" },
    ],
    materials: [
      { id: "m-1", name: "Lime Plaster", detail: "Ivory matte finish" },
      { id: "m-2", name: "Travertine Stone", detail: "Honed Roman slabs" },
      { id: "m-3", name: "White Oak", detail: "Custom joinery" },
    ],
    beforeAfters: [],
  },
  "the-courtyard-villa": {
    id: "the-courtyard-villa",
    slug: "the-courtyard-villa",
    title: "The Courtyard Villa",
    summary: "An expansive coastal sanctuary in Goa with open courtyards, natural ventilation, and organic stone textures.",
    description: "The Courtyard Villa celebrates coastal living with deep overhangs, central water bodies, and raw terrazzo surfaces that reflect tropical light throughout the day.",
    coverMediaUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    location: "Goa, India",
    client: "Private Villa",
    year: "2024",
    area: "8,200 sq.ft",
    budget: "Confidential",
    timeline: "18 Months",
    status: "PUBLISHED",
    isFeatured: true,
    category: { id: "cat-1", name: "Residential", slug: "residential" },
    designer: { id: "d-1", name: "Lumina Design Studio", jobTitle: "Principal Architects", image: null },
    images: [
      { id: "img-3", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop", alt: "Courtyard View" },
    ],
    materials: [
      { id: "m-4", name: "Laterite Stone", detail: "Local quarry" },
      { id: "m-5", name: "Teak Wood", detail: "Reclaimed architectural beams" },
    ],
    beforeAfters: [],
  },
  "the-calm-residence": {
    id: "the-calm-residence",
    slug: "the-calm-residence",
    title: "The Calm Residence",
    summary: "A modern penthouse in Pune defined by soft monochrome palettes and concealed architectural lighting.",
    description: "Minimalism meets warmth in this urban penthouse retreat. Acoustic plaster ceilings, custom brushed brass hardware, and floating walnut joinery define the calm aesthetic.",
    coverMediaUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
    location: "Pune, India",
    client: "Private Client",
    year: "2025",
    area: "4,800 sq.ft",
    budget: "Confidential",
    timeline: "10 Months",
    status: "PUBLISHED",
    isFeatured: true,
    category: { id: "cat-1", name: "Residential", slug: "residential" },
    designer: { id: "d-1", name: "Lumina Design Studio", jobTitle: "Principal Architects", image: null },
    images: [],
    materials: [
      { id: "m-6", name: "Brushed Brass", detail: "Custom fixtures" },
      { id: "m-7", name: "Walnut", detail: "Full-height paneling" },
    ],
    beforeAfters: [],
  },
  "the-oakline-retreat": {
    id: "the-oakline-retreat",
    slug: "the-oakline-retreat",
    title: "The Oakline Retreat",
    summary: "A luxury estate boutique retreat in Coorg nestled amidst lush plantation rainforests.",
    description: "Harmonizing rich timber paneling with local stone masonry, The Oakline Retreat offers an immersive luxury experience surrounded by nature.",
    coverMediaUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
    location: "Coorg, India",
    client: "Boutique Hospitality",
    year: "2024",
    area: "12,000 sq.ft",
    budget: "Confidential",
    timeline: "20 Months",
    status: "PUBLISHED",
    isFeatured: true,
    category: { id: "cat-2", name: "Hospitality", slug: "hospitality" },
    designer: { id: "d-1", name: "Lumina Design Studio", jobTitle: "Principal Architects", image: null },
    images: [],
    materials: [
      { id: "m-8", name: "Smoked Oak", detail: "Flooring & cladding" },
    ],
    beforeAfters: [],
  },
  "oceanview-residence": {
    id: "oceanview-residence",
    slug: "oceanview-residence",
    title: "Oceanview Residence",
    summary: "A coastal home that opens up to the ocean and embraces natural light in every corner.",
    description: "Minimal textures meet organic fluidity in this oceanfront sanctuary.",
    coverMediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    location: "Mangalore, India",
    client: "Private Client",
    year: "2025",
    area: "5,500 sq.ft",
    budget: "Confidential",
    timeline: "12 Months",
    status: "PUBLISHED",
    isFeatured: true,
    category: { id: "cat-1", name: "Residential", slug: "residential" },
    designer: { id: "d-1", name: "Lumina Design Studio", jobTitle: "Principal Architects", image: null },
    images: [],
    materials: [],
    beforeAfters: [],
  },
};

export const getProjectCategories = cache(async () => {
  try {
    const categories = await db.projectCategory.findMany({ orderBy: { order: "asc" } });
    if (categories.length > 0) return categories;
  } catch {
    // Graceful fallback
  }
  return [
    { id: "cat-1", name: "Residential", slug: "residential", order: 1 },
    { id: "cat-2", name: "Hospitality", slug: "hospitality", order: 2 },
    { id: "cat-3", name: "Commercial", slug: "commercial", order: 3 },
  ];
});

export const getPublishedProjects = cache(
  async (opts?: { categorySlug?: string; tag?: string }) => {
    try {
      const projects = await db.project.findMany({
        where: {
          status: "PUBLISHED",
          ...(opts?.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
          ...(opts?.tag ? { tags: { has: opts.tag } } : {}),
        },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        include: { category: true },
      });
      if (projects.length > 0) return projects;
    } catch {
      // Graceful fallback
    }

    const list = Object.values(FALLBACK_PROJECTS);
    if (opts?.categorySlug) {
      return list.filter((p) => p.category?.slug === opts.categorySlug);
    }
    return list;
  },
);

export const getFeaturedProjects = cache(async (limit = 6) => {
  try {
    const projects = await db.project.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { order: "asc" },
      take: limit,
      include: { category: true },
    });
    if (projects.length > 0) return projects;
  } catch {
    // Graceful fallback
  }
  return Object.values(FALLBACK_PROJECTS).slice(0, limit);
});

export const getProjectBySlug = cache(async (slug: string) => {
  try {
    const project = await db.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        category: true,
        designer: { select: { id: true, name: true, jobTitle: true, image: true } },
        images: { orderBy: { order: "asc" }, include: { media: true } },
        materials: true,
        beforeAfters: { orderBy: { order: "asc" } },
      },
    });
    if (project) return project;
  } catch {
    // Graceful fallback
  }

  if (FALLBACK_PROJECTS[slug]) {
    return FALLBACK_PROJECTS[slug];
  }

  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const genericFallback: FallbackProject = {
    id: slug,
    slug: slug,
    title: formattedTitle,
    summary: "An ultra-premium architectural design project by Lumina Spaces.",
    description: "Designed with architectural restraint, sensory tactile materials, and precision lighting.",
    coverMediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    location: "India",
    client: "Private Client",
    year: "2025",
    area: "5,000 sq.ft",
    budget: "Confidential",
    timeline: "12 Months",
    status: "PUBLISHED",
    isFeatured: true,
    category: { id: "cat-1", name: "Residential", slug: "residential" },
    designer: { id: "d-1", name: "Lumina Design Studio", jobTitle: "Principal Architects", image: null },
    images: [],
    materials: [],
    beforeAfters: [],
  };

  return genericFallback;
});

export const getRelatedProjects = cache(
  async (projectId: string, categoryId: string | null, limit = 3) => {
    try {
      const projects = await db.project.findMany({
        where: {
          status: "PUBLISHED",
          id: { not: projectId },
          ...(categoryId ? { categoryId } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { category: true },
      });
      if (projects.length > 0) return projects;
    } catch {
      // Graceful fallback
    }

    return Object.values(FALLBACK_PROJECTS)
      .filter((p) => p.id !== projectId)
      .slice(0, limit);
  },
);

export const getPublishedProjectSlugs = cache(async () => {
  try {
    const slugs = await db.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    if (slugs.length > 0) return slugs;
  } catch {
    // Graceful fallback
  }

  return Object.keys(FALLBACK_PROJECTS).map((slug) => ({
    slug,
    updatedAt: new Date(),
  }));
});

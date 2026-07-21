import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getPublishedServices = cache(async () => {
  return db.service.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });
});

export const getFeaturedServices = cache(async (limit = 6) => {
  return db.service.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { order: "asc" },
    take: limit,
  });
});

export const getServiceBySlug = cache(async (slug: string) => {
  return db.service.findFirst({
    where: { slug, isPublished: true },
    include: {
      benefits: { orderBy: { order: "asc" } },
      processSteps: { orderBy: { step: "asc" } },
      faqs: { where: { isPublished: true }, orderBy: { order: "asc" } },
    },
  });
});

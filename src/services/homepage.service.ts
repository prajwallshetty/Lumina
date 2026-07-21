import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getHomepageContent = cache(async () => {
  return db.homepageContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
    include: { stats: { orderBy: { order: "asc" } } },
  });
});

/** Shared, framework-agnostic types used across the app. */

export type { ActionResult } from "@/lib/action";

/** A resolved Cloudinary media slot as rendered on the site. */
export type MediaSlot = {
  url: string | null;
  publicId?: string | null;
  alt?: string | null;
  type?: "IMAGE" | "VIDEO" | "DOCUMENT";
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type SortDirection = "asc" | "desc";

export type SelectOption = { label: string; value: string };

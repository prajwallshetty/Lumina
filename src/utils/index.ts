/** Pure, dependency-light helpers. Safe for both server and client. */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string, locale = "en-US"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCurrency(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatCompactNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { notation: "compact" }).format(value);
}

export function truncate(text: string, length = 160): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

export function readingTime(text: string, wordsPerMinute = 220): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Absolute URL helper for canonical/OG values. */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}

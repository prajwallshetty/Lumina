/**
 * Lightweight in-memory sliding-window rate limiter for form/mutation
 * endpoints. Swap the store for Upstash/Redis in a multi-instance deployment
 * without changing call sites.
 */
type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  bucket.count += 1;
  const success = bucket.count <= limit;
  return { success, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt };
}

/** Periodic cleanup to keep the map bounded. */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (bucket.resetAt < now) store.delete(key);
    }
  }, 60_000).unref?.();
}

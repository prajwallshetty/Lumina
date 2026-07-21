import { z } from "zod";
import type { UserRole } from "@prisma/client";
import { getCurrentUser, type SessionUser } from "./session";
import { can } from "./rbac";
import { rateLimit } from "./rate-limit";

/** Discriminated result returned by every Server Action. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}
export function fail(error: string, fieldErrors?: Record<string, string[]>): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

type ActionContext = { user: SessionUser };

type BuilderOptions<S extends z.ZodTypeAny> = {
  input?: S;
  permission?: string;
  roles?: UserRole[];
  rateLimit?: { key: string; limit?: number; windowMs?: number };
};

/**
 * Wrap a Server Action with Zod validation, auth, RBAC, and optional rate
 * limiting. Public actions (contact form etc.) omit `permission`/`roles`.
 */
export function defineAction<S extends z.ZodTypeAny, R>(
  options: BuilderOptions<S>,
  handler: (args: { input: z.infer<S>; ctx: ActionContext | null }) => Promise<ActionResult<R>>,
) {
  return async (rawInput: z.infer<S>): Promise<ActionResult<R>> => {
    try {
      if (options.rateLimit) {
        const { key, limit, windowMs } = options.rateLimit;
        if (!rateLimit(key, { limit, windowMs }).success) {
          return fail("Too many requests. Please try again shortly.");
        }
      }

      let ctx: ActionContext | null = null;
      const needsAuth = options.permission || options.roles;
      if (needsAuth) {
        const user = await getCurrentUser();
        if (!user || !user.isActive) return fail("You must be signed in.");
        if (options.roles && !options.roles.includes(user.role)) {
          return fail("You do not have permission to perform this action.");
        }
        if (options.permission && !(await can(user.role, options.permission))) {
          return fail("You do not have permission to perform this action.");
        }
        ctx = { user };
      }

      let input = rawInput;
      if (options.input) {
        const parsed = options.input.safeParse(rawInput);
        if (!parsed.success) {
          return fail("Validation failed.", parsed.error.flatten().fieldErrors as Record<string, string[]>);
        }
        input = parsed.data;
      }

      return await handler({ input, ctx });
    } catch (error) {
      console.error("[action] unhandled error", error);
      return fail("Something went wrong. Please try again.");
    }
  };
}

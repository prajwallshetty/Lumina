import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { auth } from "./auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  isActive: boolean;
};

/** Read the current session (deduped per request). Returns null when signed out. */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return {
    user: session.user as unknown as SessionUser,
    session: session.session,
  };
});

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/** Require an authenticated, active user or redirect to sign-in. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || !user.isActive) redirect("/admin/sign-in");
  return user;
}

/** Require a user whose role is in `roles`, else redirect to the admin 403 page. */
export async function requireRole(roles: UserRole[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/admin/forbidden");
  return user;
}

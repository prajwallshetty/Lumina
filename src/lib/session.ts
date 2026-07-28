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

import { cookies } from "next/headers";
import { db } from "./db";

/** Read the current session (deduped per request). Returns null when signed out. */
export const getSession = cache(async () => {
  // Check custom password-only session cookie first
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("lumina_admin_session")?.value;
    
    if (adminSession === "authenticated") {
      const dbUser = await db.user.findFirst({
        where: { role: "SUPER_ADMIN", isActive: true },
      });
      if (dbUser) {
        return {
          user: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
            role: dbUser.role,
            isActive: dbUser.isActive,
          } as SessionUser,
          session: {
            id: "mock-session",
            userId: dbUser.id,
            token: "mock-token",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
      }
    }
  } catch (e) {
    console.error("Error reading custom session cookie", e);
  }

  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
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

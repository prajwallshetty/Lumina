import { cache } from "react";
import type { UserRole } from "@prisma/client";
import { db } from "./db";

/**
 * RBAC utilities. `UserRole` drives coarse route gating; the editable
 * permission matrix (Permission + RolePermission) drives fine-grained checks.
 */

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  CONTENT_EDITOR: "Content Editor",
  DESIGNER: "Designer",
  SALES: "Sales",
  VIEWER: "Viewer",
};

export const ROLE_RANK: Record<UserRole, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  CONTENT_EDITOR: 60,
  DESIGNER: 40,
  SALES: 40,
  VIEWER: 10,
};

export function atLeast(role: UserRole, min: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

/** Resolve the allowed permission keys for a role from the DB matrix (deduped). */
export const getRolePermissions = cache(async (role: UserRole): Promise<Set<string>> => {
  if (role === "SUPER_ADMIN") return new Set(["*"]);
  const rows = await db.rolePermission.findMany({
    where: { role, allowed: true },
    select: { permission: { select: { key: true } } },
  });
  return new Set(rows.map((r) => r.permission.key));
});

export async function can(role: UserRole, permissionKey: string): Promise<boolean> {
  const perms = await getRolePermissions(role);
  return perms.has("*") || perms.has(permissionKey);
}

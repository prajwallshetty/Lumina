import { headers } from "next/headers";
import { db } from "./db";

/** Append an entry to the audit trail. Never throws into the caller. */
export async function recordAudit(input: {
  userId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const h = await headers();
    await db.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata as never,
        ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        userAgent: h.get("user-agent") ?? null,
      },
    });
  } catch (error) {
    console.error("[audit] failed to record", error);
  }
}

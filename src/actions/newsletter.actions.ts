"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { recordAudit } from "@/lib/audit";
import { InquirySource, InquiryStatus } from "@prisma/client";

export const deleteSubscriber = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "crm.manage" },
  async ({ input, ctx }) => {
    const sub = await db.inquiry.delete({ where: { id: input.id } });
    await recordAudit({
      userId: ctx?.user.id,
      action: "newsletter.unsubscribe",
      entityType: "Inquiry",
      entityId: input.id,
      metadata: { email: sub.email },
    });
    return ok(null);
  }
);

export const subscribeNewsletter = defineAction(
  { input: z.object({ email: z.string().email("Enter a valid email") }), rateLimit: { key: "newsletter", limit: 3, windowMs: 60000 } },
  async ({ input }) => {
    // Check if already subscribed in inquiries where source is FOOTER
    const existing = await db.inquiry.findFirst({
      where: { email: input.email, source: InquirySource.FOOTER },
    });
    if (existing) {
      return ok({ id: existing.id, message: "Already subscribed." });
    }

    const sub = await db.inquiry.create({
      data: {
        email: input.email,
        name: "Newsletter Subscriber",
        source: InquirySource.FOOTER,
        status: InquiryStatus.NEW,
        message: "Subscribed to newsletter.",
      },
    });

    await recordAudit({
      action: "newsletter.subscribe",
      entityType: "Inquiry",
      entityId: sub.id,
      metadata: { email: sub.email },
    });

    return ok({ id: sub.id, message: "Thank you for subscribing!" });
  }
);

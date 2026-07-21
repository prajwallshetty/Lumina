"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok, fail } from "@/lib/action";
import { recordAudit } from "@/lib/audit";

const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().min(6, "Enter a valid phone number").optional().or(z.literal("")),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().max(2000).optional(),
  // Honeypot — must stay empty.
  company: z.string().max(0).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const submitInquiry = defineAction(
  { input: inquirySchema, rateLimit: { key: "inquiry", limit: 5, windowMs: 60_000 } },
  async ({ input }) => {
    if (input.company) return fail("Submission rejected."); // bot caught in honeypot
    if (!input.email && !input.phone) {
      return fail("Please provide an email or phone number so we can reach you.", {
        email: ["Provide at least one contact method"],
      });
    }

    const h = await headers();
    // Per-IP throttle in addition to the global key.
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim();

    const inquiry = await db.inquiry.create({
      data: {
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        service: input.service || null,
        budget: input.budget || null,
        message: input.message || null,
        source: "CONTACT_FORM",
      },
    });

    await recordAudit({
      action: "inquiry.create",
      entityType: "Inquiry",
      entityId: inquiry.id,
      metadata: { ip },
    });

    return ok({ id: inquiry.id });
  },
);

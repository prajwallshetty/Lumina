"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok, fail } from "@/lib/action";
import { recordAudit } from "@/lib/audit";

const bookingSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().max(2000).optional(),
  scheduledAt: z.coerce.date().refine((d) => d.getTime() > Date.now(), "Choose a future date/time"),
  company: z.string().max(0).optional(), // honeypot
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const submitBooking = defineAction(
  { input: bookingSchema, rateLimit: { key: "booking", limit: 5, windowMs: 60_000 } },
  async ({ input }) => {
    if (input.company) return fail("Submission rejected.");

    const booking = await db.booking.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        service: input.service || null,
        message: input.message || null,
        scheduledAt: input.scheduledAt,
      },
    });

    await recordAudit({ action: "booking.create", entityType: "Booking", entityId: booking.id });
    return ok({ id: booking.id });
  },
);

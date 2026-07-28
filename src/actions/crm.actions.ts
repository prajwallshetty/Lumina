"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { defineAction, ok } from "@/lib/action";
import { InquiryStatus, BookingStatus } from "@prisma/client";

// Inquiry actions
export const updateInquiryStatus = defineAction(
  { input: z.object({ id: z.string(), status: z.nativeEnum(InquiryStatus) }), roles: ["SUPER_ADMIN", "ADMIN", "SALES"], permission: "crm.manage" },
  async ({ input }) => {
    const inquiry = await db.inquiry.update({
      where: { id: input.id },
      data: { status: input.status },
    });
    revalidatePath("/inquiries");
    return ok(inquiry);
  }
);

export const assignInquiry = defineAction(
  { input: z.object({ id: z.string(), userId: z.string().nullable() }), roles: ["SUPER_ADMIN", "ADMIN", "SALES"], permission: "crm.manage" },
  async ({ input }) => {
    const inquiry = await db.inquiry.update({
      where: { id: input.id },
      data: { assignedToId: input.userId },
    });
    revalidatePath("/inquiries");
    return ok(inquiry);
  }
);

export const deleteInquiry = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "crm.manage" },
  async ({ input }) => {
    await db.inquiry.delete({ where: { id: input.id } });
    revalidatePath("/inquiries");
    return ok(null);
  }
);

// Booking actions
export const updateBookingStatus = defineAction(
  { input: z.object({ id: z.string(), status: z.nativeEnum(BookingStatus) }), roles: ["SUPER_ADMIN", "ADMIN", "DESIGNER", "SALES"], permission: "crm.manage" },
  async ({ input }) => {
    const booking = await db.booking.update({
      where: { id: input.id },
      data: { status: input.status },
    });
    revalidatePath("/bookings");
    return ok(booking);
  }
);

export const assignBooking = defineAction(
  { input: z.object({ id: z.string(), userId: z.string().nullable() }), roles: ["SUPER_ADMIN", "ADMIN", "SALES"], permission: "crm.manage" },
  async ({ input }) => {
    const booking = await db.booking.update({
      where: { id: input.id },
      data: { designerId: input.userId },
    });
    revalidatePath("/bookings");
    return ok(booking);
  }
);

export const deleteBooking = defineAction(
  { input: z.object({ id: z.string() }), roles: ["SUPER_ADMIN", "ADMIN"], permission: "crm.manage" },
  async ({ input }) => {
    await db.booking.delete({ where: { id: input.id } });
    revalidatePath("/bookings");
    return ok(null);
  }
);

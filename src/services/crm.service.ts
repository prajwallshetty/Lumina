import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function listInquiries(filter?: Prisma.InquiryWhereInput) {
  return db.inquiry.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { id: true, name: true } } },
  });
}

export async function getInquiry(id: string) {
  return db.inquiry.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function listBookings(filter?: Prisma.BookingWhereInput) {
  return db.booking.findMany({
    where: filter,
    orderBy: { scheduledAt: "asc" },
    include: { designer: { select: { id: true, name: true } } },
  });
}

export async function listAssignableStaff() {
  return db.user.findMany({
    where: { isActive: true, role: { in: ["SUPER_ADMIN", "ADMIN", "SALES", "DESIGNER"] } },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });
}

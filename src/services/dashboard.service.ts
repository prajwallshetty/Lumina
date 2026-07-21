import "server-only";
import { db } from "@/lib/db";

export async function getDashboardStats() {
  const [projects, publishedProjects, posts, inquiries, newInquiries, bookings, pendingBookings, testimonials] =
    await Promise.all([
      db.project.count(),
      db.project.count({ where: { status: "PUBLISHED" } }),
      db.blogPost.count(),
      db.inquiry.count(),
      db.inquiry.count({ where: { status: "NEW" } }),
      db.booking.count(),
      db.booking.count({ where: { status: "PENDING" } }),
      db.testimonial.count(),
    ]);

  return {
    projects,
    publishedProjects,
    posts,
    inquiries,
    newInquiries,
    bookings,
    pendingBookings,
    testimonials,
  };
}

export async function getRecentInquiries(limit = 5) {
  return db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { assignedTo: { select: { name: true } } },
  });
}

export async function getUpcomingBookings(limit = 5) {
  return db.booking.findMany({
    where: { scheduledAt: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
    orderBy: { scheduledAt: "asc" },
    take: limit,
    include: { designer: { select: { name: true } } },
  });
}

/** Monthly inquiry counts for the last 6 months (for the dashboard chart). */
export async function getMonthlyInquiryTrend() {
  const rows = await db.inquiry.findMany({
    where: { createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180) } },
    select: { createdAt: true },
  });
  const buckets = new Map<string, number>();
  for (const row of rows) {
    const key = row.createdAt.toLocaleString("en-US", { month: "short" });
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets, ([month, count]) => ({ month, count }));
}

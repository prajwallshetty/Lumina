import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { BookingsManager } from "@/components/admin/bookings-manager";
import { requireRole } from "@/lib/session";
import { listBookings, listAssignableStaff } from "@/services/crm.service";

export const metadata: Metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN", "SALES", "DESIGNER"]);
  const [bookings, staff] = await Promise.all([
    listBookings(),
    listAssignableStaff(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Bookings" description="Consultation appointments with designer assignment and status." />
      <BookingsManager bookings={bookings} staff={staff} />
    </div>
  );
}

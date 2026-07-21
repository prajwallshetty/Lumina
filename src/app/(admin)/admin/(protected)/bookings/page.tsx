import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/session";
import { listBookings } from "@/services/crm.service";

export const metadata: Metadata = { title: "Bookings" };

const STATUS_VARIANT = {
  PENDING: "warning",
  CONFIRMED: "accent",
  COMPLETED: "success",
  CANCELLED: "secondary",
  NO_SHOW: "destructive",
} as const;

export default async function AdminBookingsPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN", "SALES", "DESIGNER"]);
  const bookings = await listBookings();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Bookings" description="Consultation appointments with designer assignment and status." />

      {bookings.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No bookings yet" description="Consultation requests will appear here." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Designer</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {b.scheduledAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{b.service ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{b.designer?.name ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

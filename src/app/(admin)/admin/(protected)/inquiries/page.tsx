import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/session";
import { listInquiries } from "@/services/crm.service";
import { formatDate } from "@/utils";

export const metadata: Metadata = { title: "Inquiries" };

const STATUS_VARIANT = {
  NEW: "accent",
  CONTACTED: "warning",
  QUALIFIED: "secondary",
  WON: "success",
  LOST: "destructive",
} as const;

export default async function AdminInquiriesPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN", "SALES"]);
  const inquiries = await listInquiries();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Inquiries" description="Every form submission from the website, with status and assignment." />

      {inquiries.length === 0 ? (
        <EmptyState icon={Inbox} title="No inquiries yet" description="Submissions from the contact form will appear here." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="font-medium">{inq.name}</TableCell>
                  <TableCell className="text-muted-foreground">{inq.email ?? inq.phone ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{inq.service ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{inq.assignedTo?.name ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[inq.status]}>{inq.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(inq.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

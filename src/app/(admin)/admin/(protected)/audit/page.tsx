import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Audit Log" };

export default async function AdminAuditPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Audit log" description="A record of significant actions across the platform." />

      {logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="No activity recorded yet" description="Actions like content edits and submissions will be logged here." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="secondary">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.entityType ? `${log.entityType}${log.entityId ? ` · ${log.entityId.slice(0, 8)}` : ""}` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.user?.name ?? "System"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.createdAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
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

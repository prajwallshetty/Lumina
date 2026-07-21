import type { Metadata } from "next";
import { Plus, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { ROLE_LABELS } from "@/lib/rbac";
import { initials } from "@/utils";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users & roles"
        description="Manage team members and their role-based access."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> Invite user
          </Button>
        }
      />

      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" description="Invite team members to collaborate." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{ROLE_LABELS[u.role]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isActive ? "success" : "destructive"}>
                      {u.isActive ? "Active" : "Disabled"}
                    </Badge>
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

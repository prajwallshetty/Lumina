import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FieldPreview } from "@/components/admin/field-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/rbac";
import { initials } from "@/utils";

export const metadata: Metadata = { title: "Profile" };

export default async function AdminProfilePage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Profile" description="Your account details." />
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-heading text-lg font-medium">{user.name}</p>
              <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldPreview label="Email" value={user.email} />
            <FieldPreview label="Role" value={ROLE_LABELS[user.role]} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

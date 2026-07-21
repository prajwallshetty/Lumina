import { requireUser } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

// The admin is always authenticated and data-live — never prerender.
export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-dvh bg-secondary/30">
      <AdminSidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={user} />
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

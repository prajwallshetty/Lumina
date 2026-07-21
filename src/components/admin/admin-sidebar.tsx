"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { adminNav, adminNavGroups } from "@/config/admin-nav";

export function AdminSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const visible = adminNav.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo href="/admin" />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {adminNavGroups.map((group) => {
          const items = visible.filter((i) => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-6">
              <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-accent/10 text-accent"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

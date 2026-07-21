"use client";

import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { ROLE_LABELS } from "@/lib/rbac";
import { initials } from "@/utils";
import type { SessionUser } from "@/lib/session";

export function AdminTopbar({ user }: { user: SessionUser }) {
  const router = useRouter();

  const onSignOut = async () => {
    await authClient.signOut();
    router.push("/admin/sign-in");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/85 px-4 backdrop-blur-md md:px-6">
      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search…" className="h-9 pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/admin/profile")}>
              <UserIcon className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

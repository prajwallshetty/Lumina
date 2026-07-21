import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Access denied", robots: { index: false } };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="font-heading text-2xl font-semibold">Access denied</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your role doesn&apos;t have permission to view this area. Contact a Super Admin if you
        believe this is a mistake.
      </p>
      <Button asChild variant="outline">
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}

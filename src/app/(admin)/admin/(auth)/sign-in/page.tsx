import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { Logo } from "@/components/shared/logo";
import { SignInForm } from "@/components/admin/sign-in-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo className="text-2xl" />
          <p className="text-sm text-muted-foreground">Sign in to the Lumina admin</p>
        </div>
        <SignInForm />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

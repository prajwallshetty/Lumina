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
    <div className="relative flex min-h-dvh items-center justify-center bg-gradient-to-tr from-[#F3EFE9] via-[#FCFAF8] to-[#EBE4D8] px-4 overflow-hidden">
      {/* Decorative premium ambient glows */}
      <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-[10%] -bottom-[10%] h-[50%] w-[50%] rounded-full bg-[#B79D89]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm z-10 space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo className="scale-110 transition-transform duration-300" />
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mt-2">
            Secure Admin Gateway
          </p>
        </div>
        
        <SignInForm />
        
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground hover:underline transition-all duration-300">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

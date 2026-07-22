"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { primaryNav, type NavLink } from "@/config/navigation";

export function SiteHeader({ nav = primaryNav }: { nav?: NavLink[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface/90 backdrop-blur-md border-b border-outline-variant/30"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <nav className="flex justify-between items-center w-full container-editorial py-6">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-label-caps transition-colors hover:text-primary",
                  active
                    ? "text-primary border-b border-primary pb-1"
                    : "text-on-surface-variant",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA + Mobile toggle */}
        <div className="flex items-center gap-6">
          <Link
            href="/contact?intent=consultation"
            className="hidden lg:flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-label-caps transition-all hover:opacity-80 active:scale-95"
          >
            Book Consultation
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-8 flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-3 text-lg font-medium transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/contact?intent=consultation"
                  className="mt-4 bg-primary text-primary-foreground px-6 py-3 text-label-caps text-center"
                >
                  Book Consultation
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

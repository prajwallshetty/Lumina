"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowUpRight, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

type HeaderNavProps = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

const navItems: HeaderNavProps[] = [
  { label: "Projects", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/#process" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Magnetic CTA state
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
    setBtnPos({ x, y });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 sm:pt-6 px-4 sm:px-8 pointer-events-none transition-all duration-500">
      <div
        className={cn(
          "mx-auto transition-all duration-500 pointer-events-auto",
          scrolled ? "max-w-5xl scale-[0.98]" : "max-w-6xl scale-100"
        )}
      >
        {/* Floating Glass Capsule Navigation Bar */}
        <div
          className={cn(
            "w-full flex items-center justify-between px-6 sm:px-8 transition-all duration-500 rounded-full border border-black/[0.08]",
            scrolled
              ? "py-2.5 bg-white/90 backdrop-blur-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)]"
              : "py-3.5 bg-white/75 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]"
          )}
        >
          {/* Logo Left: Brand Image Logo */}
          <Link href="/" className="group flex items-center gap-3" data-cursor-magnetic>
            <Image
              src="/luminalogo.png"
              alt="Lumina Spaces"
              width={240}
              height={70}
              priority
              className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Links Center */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1 text-xs font-medium tracking-[0.08em] text-[#1A1A1A] py-1 transition-colors hover:text-[#B79D89] group",
                    active ? "font-semibold text-[#1A1A1A]" : "text-[#4A4A4A]"
                  )}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="h-3 w-3 text-[#6F6F6F] transition-transform duration-300 group-hover:rotate-180" />
                  )}
                  {/* Animated Hover Underline Expansion */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#B79D89] transition-all duration-300 group-hover:w-full",
                      active ? "w-full bg-[#1A1A1A]" : ""
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section: Magnetic CTA + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Magnetic Capsule CTA Button */}
            <motion.div
              animate={{ x: btnPos.x, y: btnPos.y }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
            >
              <Link
                ref={btnRef}
                href="/contact?intent=consultation"
                data-cursor-magnetic
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setBtnPos({ x: 0, y: 0 })}
                className="hidden sm:inline-flex items-center gap-2 bg-[#F6F4F0] text-[#1A1A1A] border border-black/[0.08] px-5 py-2.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#1A1A1A] hover:text-white group shadow-xs relative overflow-hidden"
              >
                <span className="relative z-10">BOOK CONSULTATION</span>
                <ArrowUpRight className="h-3.5 w-3.5 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>

            {/* Mobile & Extra Menu Button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden w-10 h-10 rounded-full border border-black/10 bg-black/[0.02] flex items-center justify-center text-[#1A1A1A] transition-all duration-300 hover:bg-black hover:text-white"
                  aria-label="Open Navigation Menu"
                  data-cursor-magnetic
                >
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm bg-[#FCFAF8] border-l border-black/5 p-8">
                <SheetTitle className="text-left font-heading text-xl tracking-widest text-[#1A1A1A]">
                  LUMINA SPACES
                </SheetTitle>
                <div className="mt-10 flex flex-col gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="font-heading text-2xl font-light text-[#1A1A1A] hover:text-[#B79D89] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/contact?intent=consultation"
                    className="mt-6 bg-[#1A1A1A] text-[#FCFAF8] px-6 py-3.5 rounded-full text-xs tracking-widest text-center uppercase font-medium hover:bg-[#B79D89] transition-colors"
                  >
                    Book Consultation ↗
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

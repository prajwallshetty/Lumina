import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings().catch(() => null);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] text-[#FCFAF8] relative z-20 overflow-hidden select-none border-t border-white/10">
      {/* Huge Subtle Logo Watermark in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
        <span className="font-heading text-[18vw] font-light tracking-[0.1em] text-white uppercase whitespace-nowrap">
          LUMINA SPACES
        </span>
      </div>

      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-16 pt-24 pb-16 relative z-10">
        {/* Main Editorial Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20 border-b border-white/10">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <span className="font-heading text-2xl font-semibold tracking-[0.2em] uppercase text-white">
                LUMINA <span className="font-light text-[#B79D89]">SPACES</span>
              </span>
            </Link>
            <p className="font-body text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm mb-8 font-light">
              {settings?.tagline ??
                "We create architectural environments and bespoke residential sanctuaries that combine quiet minimalism, sensory warmth, and timeless craftsmanship."}
            </p>
            <div className="flex items-center gap-6 text-xs tracking-[0.18em] uppercase font-semibold text-white/80">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                data-cursor-magnetic
                className="hover:text-[#B79D89] transition-colors flex items-center gap-1"
              >
                <span>INSTAGRAM</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                data-cursor-magnetic
                className="hover:text-[#B79D89] transition-colors flex items-center gap-1"
              >
                <span>PINTEREST</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noreferrer"
                data-cursor-magnetic
                className="hover:text-[#B79D89] transition-colors flex items-center gap-1"
              >
                <span>BEHANCE</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-mono tracking-[0.25em] text-[#B79D89] uppercase font-bold mb-6">
              NAVIGATION
            </h4>
            <ul className="space-y-3.5 text-xs font-body text-white/70">
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Selected Works
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Architectural Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Studio & Philosophy
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-white transition-colors">
                  Design Process
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Journal & Essays
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location Column */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-mono tracking-[0.25em] text-[#B79D89] uppercase font-bold mb-6">
              STUDIO ENQUIRIES
            </h4>
            <div className="space-y-3 text-xs font-body text-white/70 leading-relaxed">
              <p>{settings?.addressLine ?? "Bengaluru & Goa, India"}</p>
              <p>
                <a href={`mailto:${settings?.email ?? "hello@luminaspaces.com"}`} className="hover:text-[#B79D89] transition-colors">
                  {settings?.email ?? "hello@luminaspaces.com"}
                </a>
              </p>
              <p>
                <a href={`tel:${settings?.phone ?? "+919576543210"}`} className="hover:text-[#B79D89] transition-colors">
                  {settings?.phone ?? "+91 95765 43210"}
                </a>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/contact?intent=consultation"
                data-cursor-magnetic
                className="inline-flex items-center gap-2 text-xs tracking-[0.18em] font-bold text-white uppercase hover:text-[#B79D89] transition-colors"
              >
                <span>START A PROJECT CONSULTATION</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Row */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono tracking-widest text-white/40 uppercase">
          <p>© {year} {settings?.companyName ?? "Lumina Spaces"}. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              TERMS & CONDITIONS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

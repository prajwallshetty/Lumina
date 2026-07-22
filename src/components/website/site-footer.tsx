import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { footerNav } from "@/config/navigation";
import { getSiteSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings().catch(() => null);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-container border-t border-outline-variant/20">
      {/* Main footer grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 container-editorial py-20 lg:py-28">
        {/* Brand column */}
        <div className="md:col-span-1">
          <div className="mb-6">
            <Logo />
          </div>
          <p className="text-body-md text-on-surface-variant mb-8 max-w-xs">
            {settings?.tagline ??
              "Timeless interiors. Thoughtful design. Beautiful living for modern sanctuaries."}
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center border border-outline-variant/50 rounded-full hover:text-primary transition-colors"
              aria-label="Website"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center border border-outline-variant/50 rounded-full hover:text-primary transition-colors"
              aria-label="Share"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center border border-outline-variant/50 rounded-full hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {/* Dynamic footer nav columns */}
        {footerNav.map((col) => (
          <div key={col.heading}>
            <h4 className="text-label-caps font-bold mb-8 text-primary">{col.heading}</h4>
            <ul className="space-y-4 text-body-md text-on-surface-variant">
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter column */}
        <div>
          <h4 className="text-label-caps font-bold mb-8 text-primary">Newsletter</h4>
          <p className="text-body-md text-on-surface-variant mb-6">
            Design ideas, trends and inspiration delivered to your inbox.
          </p>
          <form className="relative group">
            <input
              className="w-full bg-transparent border-b border-outline-variant py-3 pr-10 focus:border-primary outline-none text-body-md transition-colors placeholder:text-on-surface-variant/50"
              placeholder="Enter your email"
              type="email"
            />
            <button
              className="absolute right-0 bottom-3 text-on-surface-variant hover:text-primary transition-colors"
              type="submit"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          <div className="mt-8 space-y-2 text-[12px] text-on-surface-variant">
            <p>{settings?.addressLine ?? "Mangalore, Karnataka, India"}</p>
            <p>{settings?.phone ?? "+91 12345 67890"}</p>
            <p>{settings?.email ?? "hello@luminaspaces.com"}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-editorial py-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-label-caps text-[10px] text-on-surface-variant">
          © {year} {settings?.companyName ?? "Lumina Spaces"}. All rights reserved.
        </p>
        <div className="flex gap-8">
          <Link href="/privacy" className="text-label-caps text-[10px] text-on-surface-variant hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-label-caps text-[10px] text-on-surface-variant hover:text-primary">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}

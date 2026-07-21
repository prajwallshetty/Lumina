import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { footerNav } from "@/config/navigation";
import { getSiteSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings().catch(() => null);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              {settings?.tagline ??
                "A full-service interior design studio crafting considered, timeless spaces."}
            </p>
          </div>

          {footerNav.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h3 className="text-eyebrow text-muted-foreground">{col.heading}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {settings?.companyName ?? "Lumina"}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

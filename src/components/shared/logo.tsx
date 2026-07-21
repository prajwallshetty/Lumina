import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark used until a brand logo is uploaded via Settings CMS. When a logo
 * exists it is rendered by the header/footer directly; this is the text fallback.
 */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("font-heading text-xl font-semibold tracking-tight", className)}
    >
      Lumina
      <span className="text-accent">.</span>
    </Link>
  );
}

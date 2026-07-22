import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Lumina Spaces logo with architecture icon and wordmark.
 */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        {/* Architecture / compass icon */}
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span className="text-headline-md tracking-tighter text-primary font-heading">
        Lumina Spaces
      </span>
    </Link>
  );
}

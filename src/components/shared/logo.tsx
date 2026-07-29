import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Lumina Spaces logo image.
 */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <Image
        src="/luminalogo.png"
        alt="Lumina Spaces Logo"
        width={140}
        height={35}
        className="h-8 w-auto object-contain"
        priority
        unoptimized
      />
    </Link>
  );
}

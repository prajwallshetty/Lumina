import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceCardData = {
  title: string;
  slug: string;
  excerpt?: string | null;
};

export function ServiceCard({ service, className }: { service: ServiceCardData; className?: string }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-md",
        className,
      )}
    >
      <div className="space-y-2">
        <h3 className="font-heading text-xl font-medium">{service.title}</h3>
        {service.excerpt && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{service.excerpt}</p>
        )}
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Explore
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

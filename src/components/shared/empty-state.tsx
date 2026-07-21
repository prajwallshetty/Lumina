import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Consistent empty state for admin lists before content is created. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-lg font-medium">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

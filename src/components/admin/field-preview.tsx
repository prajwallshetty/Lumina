import { cn } from "@/lib/utils";

/** Read-friendly display of a stored CMS field within an editor surface. */
export function FieldPreview({
  label,
  value,
  empty = "Not set — upload/edit via this module",
  className,
}: {
  label: string;
  value?: string | null;
  empty?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("text-sm", value ? "text-foreground" : "italic text-muted-foreground")}>
        {value || empty}
      </p>
    </div>
  );
}

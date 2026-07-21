import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-3xl font-semibold">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg",
            accent ? "bg-accent/10 text-accent" : "bg-secondary text-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

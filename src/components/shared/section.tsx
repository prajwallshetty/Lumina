import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && <span className="text-eyebrow text-accent">{eyebrow}</span>}
      <h2 className="max-w-2xl text-3xl font-medium md:text-4xl">{title}</h2>
      {description && (
        <p className={cn("max-w-2xl text-muted-foreground", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}

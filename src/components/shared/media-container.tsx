import Image from "next/image";
import { ImageIcon, Film } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaContainerProps = {
  /** Cloudinary secure URL. When null/empty an elegant empty frame is shown. */
  src?: string | null;
  alt?: string | null;
  /** aspect-ratio utility, e.g. "aspect-[4/3]", "aspect-square", "aspect-video". */
  aspect?: string;
  className?: string;
  rounded?: string;
  priority?: boolean;
  sizes?: string;
  /** Visual hint for the empty state (e.g. "Hero", "Project cover"). */
  label?: string;
  kind?: "image" | "video";
  fill?: boolean;
};

/**
 * The single source of truth for every media slot on the site. Renders the
 * uploaded Cloudinary asset when present; otherwise a refined, on-brand empty
 * placeholder frame. No stock or placeholder imagery is ever used.
 */
export function MediaContainer({
  src,
  alt,
  aspect = "aspect-[4/3]",
  className,
  rounded = "rounded-xl",
  priority = false,
  sizes = "100vw",
  label,
  kind = "image",
}: MediaContainerProps) {
  const Icon = kind === "video" ? Film : ImageIcon;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-secondary",
        aspect,
        rounded,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? label ?? ""}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground"
          role="img"
          aria-label={label ? `${label} — media placeholder` : "Media placeholder"}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(45deg,hsl(var(--muted-foreground)/0.06)_0_10px,transparent_10px_20px)]"
          />
          <Icon className="relative h-7 w-7 opacity-40" strokeWidth={1.25} />
          {label && (
            <span className="relative text-eyebrow text-[0.65rem] opacity-60">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}

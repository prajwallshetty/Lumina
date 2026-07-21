import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/utils";

type TestimonialCardData = {
  clientName: string;
  company?: string | null;
  location?: string | null;
  rating: number;
  quote: string;
  photoUrl?: string | null;
};

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: TestimonialCardData;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6",
        className,
      )}
    >
      <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < testimonial.rating ? "fill-accent text-accent" : "text-muted",
            )}
          />
        ))}
      </div>
      <blockquote className="text-pretty leading-relaxed text-foreground/90">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar>
          {testimonial.photoUrl && <AvatarImage src={testimonial.photoUrl} alt={testimonial.clientName} />}
          <AvatarFallback>{initials(testimonial.clientName)}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-medium">{testimonial.clientName}</p>
          <p className="text-muted-foreground">
            {[testimonial.company, testimonial.location].filter(Boolean).join(" · ")}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

"use client";

import { useRef, useState, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";
import { MediaContainer } from "@/components/shared/media-container";
import { cn } from "@/lib/utils";

/** Accessible before/after comparison slider (pointer + keyboard). */
export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  title,
  className,
}: {
  beforeUrl?: string | null;
  afterUrl?: string | null;
  title?: string;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-[16/10] w-full select-none overflow-hidden rounded-xl", className)}
      onPointerMove={(e) => e.buttons === 1 && updateFromClientX(e.clientX)}
      onPointerDown={(e) => updateFromClientX(e.clientX)}
    >
      {/* After (base) */}
      <MediaContainer src={afterUrl} label="After" aspect="aspect-[16/10]" rounded="rounded-none" className="absolute inset-0" />
      <span className="absolute right-3 top-3 z-10 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium">
        After
      </span>

      {/* Before (clipped overlay) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <div className="relative h-full" style={{ width: containerRef.current?.offsetWidth ?? "100%" }}>
          <MediaContainer src={beforeUrl} label="Before" aspect="aspect-[16/10]" rounded="rounded-none" className="absolute inset-0 h-full" />
        </div>
        <span className="absolute left-3 top-3 z-10 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium">
          Before
        </span>
      </div>

      {/* Handle */}
      <div className="absolute inset-y-0 z-20 flex items-center" style={{ left: `${position}%` }}>
        <div className="h-full w-0.5 -translate-x-1/2 bg-background" />
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          aria-label={`Before and after comparison${title ? ` for ${title}` : ""}`}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 h-full w-screen cursor-ew-resize opacity-0"
        />
        <div className="absolute left-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md">
          <MoveHorizontal className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

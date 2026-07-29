"use client";

import { useRef, useState, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";
import { MediaContainer } from "@/components/shared/media-container";
import { cn } from "@/lib/utils";

/** Accessible, touch-optimized before/after comparison slider for mobile and desktop. */
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

  const handleTouch = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches[0]) {
        updateFromClientX(e.touches[0].clientX);
      }
    },
    [updateFromClientX]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] sm:aspect-[16/9] w-full select-none overflow-hidden rounded-2xl border border-black/10 shadow-lg touch-none",
        className
      )}
      onPointerMove={(e) => e.buttons === 1 && updateFromClientX(e.clientX)}
      onPointerDown={(e) => updateFromClientX(e.clientX)}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
    >
      {/* After (base layer) */}
      <MediaContainer
        src={afterUrl}
        label="After"
        aspect="aspect-[16/10] sm:aspect-[16/9]"
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute right-3 top-3 z-10 rounded-full bg-[#111111]/85 backdrop-blur-md px-3 py-1 text-[9px] font-bold tracking-widest text-white uppercase border border-white/20">
        AFTER: REALITY
      </div>

      {/* Before (clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div
          className="relative h-full"
          style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
        >
          <MediaContainer
            src={beforeUrl}
            label="Before"
            aspect="aspect-[16/10] sm:aspect-[16/9]"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] font-bold tracking-widest text-[#111111] uppercase border border-black/10">
          BEFORE: SKETCH
        </div>
      </div>

      {/* Sliding Bar Divider & Handle */}
      <div
        className="absolute inset-y-0 z-20 flex items-center pointer-events-none"
        style={{ left: `${position}%` }}
      >
        {/* Vertical divider line */}
        <div className="h-full w-0.5 -translate-x-1/2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

        {/* Input for screen-reader accessibility */}
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          aria-label={`Before and after comparison${title ? ` for ${title}` : ""}`}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 pointer-events-auto"
        />

        {/* Round Touch Control Knob */}
        <div className="absolute left-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-[#111111] text-white shadow-xl transition-transform active:scale-110">
          <MoveHorizontal className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

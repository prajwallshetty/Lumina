"use client";

import { useEffect, useRef, useState, useId } from "react";
import { motion } from "framer-motion";

const DEFAULT_SKETCH_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop&sat=-100&con=30";

const DEFAULT_COMPLETED_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";

const POINT_COUNT = 24;
const SVG_WIDTH = 1600;
const SVG_HEIGHT = 900;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;

const RECT_W = 760; // Half-width of the idle rectangle in SVG space
const RECT_H = 410; // Half-height of the idle rectangle in SVG space

export type TransformationItem = {
  id?: string;
  title: string;
  caption?: string | null;
  sketchUrl?: string | null;
  beforeUrl?: string | null;
  afterUrl?: string | null;
};

export function BeforeAfterSection({ items }: { items?: TransformationItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items && items.length > 0 ? items[activeIndex] : null;

  const sketchImage = activeItem?.sketchUrl || activeItem?.beforeUrl || DEFAULT_SKETCH_IMAGE;
  const completedImage = activeItem?.afterUrl || DEFAULT_COMPLETED_IMAGE;
  const maskId = useId();
  const revealMaskId = useId();
  const gradientId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const isHoveredRef = useRef(false);

  const [pathD, setPathD] = useState("");
  const [revealPathD, setRevealPathD] = useState("");
  const [revealState, setRevealState] = useState({ x: 800, y: 450, r: 250 });

  const rawMouseRef = useRef({ x: 800, y: 450 });
  const currCursorRef = useRef({ x: 800, y: 450 });
  const currRadiusRef = useRef(250);

  // Helper to generate radii representing the clean widescreen rectangle outline
  const getRectRadii = () => {
    const list = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      const angle = (i * 2 * Math.PI) / POINT_COUNT;
      const r = 1 / Math.max(Math.abs(Math.cos(angle)) / RECT_W, Math.abs(Math.sin(angle)) / RECT_H);
      list.push(r);
    }
    return list;
  };

  const currentRadiiRef = useRef<number[]>(getRectRadii());
  const velocityRef = useRef<number[]>(new Array(POINT_COUNT).fill(0));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Translate client mouse coordinates to SVG coordinate space (1600x900)
    const x = ((e.clientX - rect.left) / rect.width) * SVG_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * SVG_HEIGHT;
    rawMouseRef.current = { x, y };
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // Reveal cursor position and radius lerping
      let targetX = rawMouseRef.current.x;
      let targetY = rawMouseRef.current.y;
      let targetR = 360; // Large reveal size on hover

      if (!isHoveredRef.current) {
        // Idle/Auto-animation: orbit the reveal cursor in a slow premium loop
        const t = now / 1000;
        targetX = CENTER_X + Math.sin(t) * 350;
        targetY = CENTER_Y + Math.cos(t * 0.8) * 180;
        targetR = 250;
      }

      currCursorRef.current.x += (targetX - currCursorRef.current.x) * 0.08;
      currCursorRef.current.y += (targetY - currCursorRef.current.y) * 0.08;
      currRadiusRef.current += (targetR - currRadiusRef.current) * 0.06;

      setRevealState({
        x: currCursorRef.current.x,
        y: currCursorRef.current.y,
        r: currRadiusRef.current,
      });

      // Calculate radii for outer container control points (perfect rounded rectangle)
      const stiffness = 0.05;
      const damping = 0.75;
      const points: { x: number; y: number }[] = [];
      const rectRadii = getRectRadii();

      for (let i = 0; i < POINT_COUNT; i++) {
        // Target is always the clean rounded rectangle
        const targetRadius = rectRadii[i];

        // Apply physical spring forces
        const force = (targetRadius - currentRadiiRef.current[i]) * stiffness;
        velocityRef.current[i] = (velocityRef.current[i] + force) * damping;
        currentRadiiRef.current[i] += velocityRef.current[i];

        const angle = (i * 2 * Math.PI) / POINT_COUNT;
        const r = currentRadiiRef.current[i];
        points.push({
          x: CENTER_X + r * Math.cos(angle),
          y: CENTER_Y + r * Math.sin(angle),
        });
      }

      // Generate rippling points for the reveal blob centered at current cursor position
      const revealPoints: { x: number; y: number }[] = [];
      const REVEAL_POINTS_COUNT = 16;
      const rx = currCursorRef.current.x;
      const ry = currCursorRef.current.y;
      const baseR = currRadiusRef.current;

      for (let b = 0; b < REVEAL_POINTS_COUNT; b++) {
        const angle = (b * 2 * Math.PI) / REVEAL_POINTS_COUNT;
        // Ripple waves to make it look organic/liquid
        const ripple = Math.sin(angle * 4 + elapsed * 3.5) * (baseR * 0.09);
        const r = baseR + ripple;
        revealPoints.push({
          x: rx + r * Math.cos(angle),
          y: ry + r * Math.sin(angle),
        });
      }

      // Catmull-Rom spline interpolation to construct the rounded outline d path
      let d = "";
      const len = points.length;
      const tension = 1.0;

      for (let i = 0; i < len; i++) {
        const p0 = points[(i - 1 + len) % len];
        const p1 = points[i];
        const p2 = points[(i + 1) % len];
        const p3 = points[(i + 2) % len];

        const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
        const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
        const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
        const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

        if (i === 0) {
          d += `M ${p1.x.toFixed(2)},${p1.y.toFixed(2)} `;
        }
        d += `C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)} `;
      }
      d += "Z";
      setPathD(d);

      // Interpolate the reveal points into path
      let rd = "";
      const rLen = revealPoints.length;
      for (let i = 0; i < rLen; i++) {
        const p0 = revealPoints[(i - 1 + rLen) % rLen];
        const p1 = revealPoints[i];
        const p2 = revealPoints[(i + 1) % rLen];
        const p3 = revealPoints[(i + 2) % rLen];

        const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
        const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
        const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
        const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

        if (i === 0) {
          rd += `M ${p1.x.toFixed(2)},${p1.y.toFixed(2)} `;
        }
        rd += `C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)} `;
      }
      rd += "Z";
      setRevealPathD(rd);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="py-24 sm:py-36 bg-[#FCFAF8] border-t border-black/[0.08] relative z-20 select-none overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-16 text-center">
        {/* Editorial Eyebrow & Title */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-semibold tracking-[0.25em] text-[#6F6F6F] uppercase block mb-3"
        >
          OUR PROCESS
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-light text-[#111111] tracking-tight mb-4"
        >
          From Vision to <span className="italic font-normal">Reality</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-xs sm:text-sm text-[#6F6F6F] max-w-lg mx-auto mb-16 leading-relaxed"
        >
          Drag your cursor across the architectural canvas to reveal reality beneath the drawing.
        </motion.p>

        {/* Giant Interactive Morphing Frame Container */}
        <div
          ref={containerRef}
          data-cursor="REVEAL"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[16/9] max-w-[1140px] mx-auto flex items-center justify-center cursor-crosshair overflow-visible"
        >
          {/* Floating Tags (Before / After Labels) */}
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-black/10 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111] pointer-events-none select-none">
            BEFORE: SKETCH
          </div>
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 bg-[#111111]/90 text-white backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase pointer-events-none select-none">
            AFTER: REALITY
          </div>

          {/* Soft Shadow Layer */}
          <div
            className="absolute inset-8 rounded-[36px] pointer-events-none bg-radial from-[#111111]/20 via-black/5 to-transparent blur-3xl"
            style={{ transform: "translateY(30px)" }}
          />

          {/* Unified SVG Canvas for Masking, Images, and Outlines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          >
            <defs>
              {/* Outer boundary clip path (stable structured rounded rectangle) */}
              <clipPath id={maskId}>
                <path d={pathD} />
              </clipPath>

              {/* Reveal brush mask radial gradient (soft feathered edge following cursor) */}
              <radialGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                cx={revealState.x}
                cy={revealState.y}
                r={revealState.r}
              >
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="65%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>

              {/* Reveal mask clipping shape using the morphing path */}
              <mask id={revealMaskId}>
                <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="black" />
                <path d={revealPathD} fill={`url(#${gradientId})`} />
              </mask>
            </defs>

            {/* Canvas Base Content clipped to outer boundary */}
            <g clipPath={`url(#${maskId})`}>
              {/* Base layer: black & white sketch image */}
              <image
                href={sketchImage}
                width={SVG_WIDTH}
                height={SVG_HEIGHT}
                preserveAspectRatio="xMidYMid slice"
              />

              {/* Warm paper tone overlay */}
              <rect
                width={SVG_WIDTH}
                height={SVG_HEIGHT}
                fill="#b08d57"
                opacity="0.08"
                style={{ mixBlendMode: "multiply" }}
              />

              {/* Top layer: color photograph image revealed by mask */}
              <image
                href={completedImage}
                width={SVG_WIDTH}
                height={SVG_HEIGHT}
                preserveAspectRatio="xMidYMid slice"
                mask={`url(#${revealMaskId})`}
              />
            </g>

            {/* Main White Ceramic Border Outline */}
            <path
              d={pathD}
              fill="none"
              stroke="#FCFAF8"
              strokeWidth="28"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 15px 30px rgba(17,17,17,0.08))",
              }}
            />

            {/* Subtle Bronze Inner Outline */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(183, 157, 137, 0.4)"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

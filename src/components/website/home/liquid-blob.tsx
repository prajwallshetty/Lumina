"use client";

import { useEffect, useRef, useState, useId } from "react";

type LiquidBlobProps = {
  videoUrl?: string;
};

const LUXURY_INTERIOR_VIDEO =
  "https://assets.mixkit.co/videos/34487/34487-720.mp4";

const POINT_COUNT = 16;
const SVG_SIZE = 780;
const CENTER = SVG_SIZE / 2;

// Reduced base radius from 290 to 240 to guarantee the blob is never clipped by the foreignObject boundaries
const BASE_RADIUS = 240;

// The exact iconic asymmetry pattern from the Courtyard Villa portfolio card
const ASYMMETRY = [
  0.92, 1.15, 0.88, 1.08, 0.94, 1.12, 0.90, 1.06,
  0.95, 1.18, 0.86, 1.10, 0.92, 1.14, 0.88, 1.05
];

export function LiquidBlob({ videoUrl = LUXURY_INTERIOR_VIDEO }: LiquidBlobProps) {
  const maskId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [pathD, setPathD] = useState("");
  const pathDRef = useRef("");

  const pullOffsetsRef = useRef<number[]>(new Array(POINT_COUNT).fill(0));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;

    const mouseAngle = Math.atan2(e.clientY - cY, e.clientX - cX);
    const distFromCenter = Math.hypot(e.clientX - cX, e.clientY - cY);
    const mouseDistRatio = Math.min(distFromCenter / (rect.width / 2), 1.2);

    for (let i = 0; i < POINT_COUNT; i++) {
      const pointAngle = (i * 2 * Math.PI) / POINT_COUNT;
      let diff = Math.abs(pointAngle - mouseAngle);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;

      const pullFactor = Math.exp(-Math.pow(diff / 0.6, 2));
      const pullOffset = pullFactor * 35 * mouseDistRatio;

      pullOffsetsRef.current[i] = pullOffset;
    }
  };

  const handleMouseEnter = () => {};
  const handleMouseLeave = () => {
    pullOffsetsRef.current.fill(0);
  };

  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < POINT_COUNT; i++) {
        const angle = (i * 2 * Math.PI) / POINT_COUNT;
        const phaseShift = angle;

        // Slow, elegant wave breathing animation (20s cycle)
        const wave = Math.sin((elapsed * 2 * Math.PI) / 20 + phaseShift) * 8;
        const currentPull = pullOffsetsRef.current[i] || 0;
        
        // Multiplied by ASYMMETRY to match the portfolio blob shape perfectly
        const r = BASE_RADIUS * ASYMMETRY[i] + wave + currentPull;

        points.push({
          x: CENTER + r * Math.cos(angle),
          y: CENTER + r * Math.sin(angle),
        });
      }

      // Catmull-Rom Spline interpolation for a seamless liquid shape
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

      if (d !== pathDRef.current) {
        pathDRef.current = d;
        setPathD(d);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-square max-w-[500px] xl:max-w-[550px] mx-auto flex items-center justify-center select-none cursor-pointer"
    >
      {/* Soft Ambient Shadow behind Blob */}
      <div className="absolute inset-6 rounded-full pointer-events-none bg-radial from-[#111111]/15 via-[#B79D89]/10 to-transparent blur-3xl transform translate-y-4" />

      {/* 1:1 Widescreen Liquid Blob Video Canvas without Borders */}
      <svg
        className="w-full h-full overflow-visible pointer-events-auto"
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      >
        <defs>
          <clipPath id={maskId}>
            <path d={pathD} />
          </clipPath>
        </defs>

        {/* Masked Video */}
        <g clipPath={`url(#${maskId})`}>
          <foreignObject x="0" y="0" width={SVG_SIZE} height={SVG_SIZE}>
            <div className="w-full h-full relative overflow-hidden bg-[#111111]">
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover scale-[1.04] transition-transform duration-700 ease-out"
              />
              {/* Subtle Color Grading Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#111111]/20 via-transparent to-[#B79D89]/15 mix-blend-soft-light pointer-events-none" />
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}

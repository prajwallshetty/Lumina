"use client";

import { useEffect, useRef, useState, useId } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Pencil sketch image (architectural presentation style)
const SKETCH_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop&sat=-100&con=30";

// Completed luxury photograph image
const COMPLETED_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";

const POINT_COUNT = 24;
const SVG_SIZE = 900;
const CENTER = SVG_SIZE / 2;
const BASE_RADIUS = 350;

export function BeforeAfterSection() {
  const maskId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  const [pathD, setPathD] = useState("");

  // Outer blob frame morph animation loop
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < POINT_COUNT; i++) {
        const phaseShift = (i * 2 * Math.PI) / POINT_COUNT;
        const wave1 = Math.sin((elapsed * 2 * Math.PI) / 16 + phaseShift) * 16;
        const wave2 = Math.cos((elapsed * 2 * Math.PI) / 10 + phaseShift * 2) * 8;
        const r = BASE_RADIUS + wave1 + wave2;

        const angle = (i * 2 * Math.PI) / POINT_COUNT;
        points.push({
          x: CENTER + r * Math.cos(angle),
          y: CENTER + r * Math.sin(angle),
        });
      }

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

        if (i === 0) d += `M ${p1.x.toFixed(2)},${p1.y.toFixed(2)} `;
        d += `C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)} `;
      }
      d += "Z";
      setPathD(d);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 60 FPS Canvas Feathered Liquid Masking Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let targetX = 0.5;
    let targetY = 0.5;
    let currX = 0.5;
    let currY = 0.5;
    let targetRadius = 0.15;
    let currRadius = 0.15;

    const imgAfter = new window.Image();
    imgAfter.crossOrigin = "anonymous";
    imgAfter.src = COMPLETED_IMAGE;

    let autoAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      // Smooth lerp physics
      if (isHovered) {
        targetX = mousePos.current.x;
        targetY = mousePos.current.y;
        targetRadius = 0.45;
      } else {
        // Mobile / idle auto oscillation
        autoAngle += 0.015;
        targetX = 0.5 + Math.sin(autoAngle) * 0.25;
        targetY = 0.5 + Math.cos(autoAngle * 0.8) * 0.15;
        targetRadius = 0.32;
      }

      currX += (targetX - currX) * 0.08;
      currY += (targetY - currY) * 0.08;
      currRadius += (targetRadius - currRadius) * 0.06;

      ctx.clearRect(0, 0, w, h);

      if (imgAfter.complete) {
        ctx.save();

        // Draw organic liquid feathered brush mask
        ctx.beginPath();
        const px = currX * w;
        const py = currY * h;
        const r = currRadius * Math.min(w, h);

        // Multi-layered organic brush perimeter
        const brushPoints = 36;
        for (let b = 0; b < brushPoints; b++) {
          const angle = (b * 2 * Math.PI) / brushPoints;
          const noise = Math.sin(angle * 5 + autoAngle * 3) * (r * 0.12);
          const br = r + noise;
          const bx = px + br * Math.cos(angle);
          const by = py + br * Math.sin(angle);
          if (b === 0) ctx.moveTo(bx, by);
          else ctx.lineTo(bx, by);
        }
        ctx.closePath();

        ctx.clip();

        // Draw full-resolution photograph inside clip
        ctx.drawImage(imgAfter, 0, 0, w, h);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mousePos.current = { x, y };
  };

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

        {/* Giant Organic Liquid Morphing Blob Container */}
        <div
          ref={containerRef}
          data-cursor="REVEAL"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-16/9 max-w-[1240px] mx-auto flex items-center justify-center cursor-crosshair"
        >
          {/* SVG Mask Definition */}
          <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
              <clipPath id={maskId} clipPathUnits="userSpaceOnUse">
                <path d={pathD} />
              </clipPath>
            </defs>
          </svg>

          {/* Soft Shadow Ambient Occlusion */}
          <div
            className="absolute inset-8 rounded-full pointer-events-none bg-radial from-[#111111]/20 via-black/5 to-transparent blur-3xl"
            style={{ transform: "translateY(30px)" }}
          />

          {/* Multi-layered Sculpted Frame */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          >
            <path
              d={pathD}
              fill="none"
              stroke="#FCFAF8"
              strokeWidth="28"
              strokeLinejoin="round"
              style={{
                filter: "drop-shadow(0 15px 30px rgba(17,17,17,0.08))",
              }}
            />
            <path
              d={pathD}
              fill="none"
              stroke="rgba(183, 157, 137, 0.4)"
              strokeWidth="2.5"
            />
          </svg>

          {/* SVG Path Masked Base Canvas */}
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              clipPath: pathD ? `url(#${maskId})` : undefined,
              WebkitClipPath: pathD ? `url(#${maskId})` : undefined,
            }}
          >
            {/* BASE LAYER: Architectural Sketch Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={SKETCH_IMAGE}
                alt="Architectural pencil sketch presentation"
                fill
                priority
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover sepia-[0.15] contrast-105"
              />
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 bg-amber-50/20 mix-blend-multiply pointer-events-none" />
              <div className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-black/10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111]">
                BEFORE: SKETCH
              </div>
            </div>

            {/* TOP REVEAL LAYER: 60FPS Canvas Feathered Liquid Mask */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-10 w-full h-full pointer-events-none"
            />

            {/* Floating Tag Top Right */}
            <div className="absolute top-8 right-8 z-20 bg-[#111111]/90 text-white backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[10px] font-bold tracking-[0.2em] uppercase">
              AFTER: REALITY
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

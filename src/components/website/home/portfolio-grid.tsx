"use client";

import { useEffect, useRef, useState, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

type Project = {
  id: string;
  num: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  asymmetry: number[];
};

const PROJECTS: Project[] = [
  {
    id: "the-ivory-house",
    num: "01",
    title: "The Ivory House",
    category: "RESIDENTIAL",
    location: "BENGALURU, INDIA",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    asymmetry: [1.08, 0.95, 1.12, 0.88, 1.05, 0.92, 1.15, 0.98, 1.04, 0.90, 1.10, 0.94, 1.06, 0.88, 1.12, 0.96],
  },
  {
    id: "the-courtyard-villa",
    num: "02",
    title: "The Courtyard Villa",
    category: "RESIDENTIAL",
    location: "GOA, INDIA",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
    asymmetry: [0.92, 1.15, 0.88, 1.08, 0.94, 1.12, 0.90, 1.06, 0.95, 1.18, 0.86, 1.10, 0.92, 1.14, 0.88, 1.05],
  },
  {
    id: "the-calm-residence",
    num: "03",
    title: "The Calm Residence",
    category: "RESIDENTIAL",
    location: "PUNE, INDIA",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop",
    asymmetry: [1.14, 0.90, 1.06, 0.94, 1.18, 0.86, 1.05, 0.92, 1.12, 0.88, 1.08, 0.96, 1.15, 0.90, 1.04, 0.98],
  },
  {
    id: "the-oakline-retreat",
    num: "04",
    title: "The Oakline Retreat",
    category: "HOSPITALITY",
    location: "COORG, INDIA",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop",
    asymmetry: [0.90, 1.12, 0.95, 1.16, 0.88, 1.04, 0.96, 1.10, 0.92, 1.14, 0.86, 1.08, 0.98, 1.15, 0.90, 1.05],
  },
];

const POINT_COUNT = 16;
const SVG_SIZE = 500;
const CENTER = SVG_SIZE / 2;
const BASE_RADIUS = 195;

function BlobProjectCard({ project, index }: { project: Project; index: number }) {
  const maskId = useId();
  const cardRef = useRef<HTMLDivElement>(null);

  const [pathD, setPathD] = useState("");
  const pathDRef = useRef("");

  const currentRadiiRef = useRef<number[]>(
    project.asymmetry.map((a) => BASE_RADIUS * a)
  );
  const velocityRef = useRef<number[]>(new Array(POINT_COUNT).fill(0));
  const targetRadiiRef = useRef<number[]>(
    project.asymmetry.map((a) => BASE_RADIUS * a)
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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
      const pullOffset = pullFactor * 40 * mouseDistRatio;

      targetRadiiRef.current[i] =
        BASE_RADIUS * project.asymmetry[i] + pullOffset;
    }
  };

  const handleMouseLeave = () => {
    for (let i = 0; i < POINT_COUNT; i++) {
      targetRadiiRef.current[i] = BASE_RADIUS * project.asymmetry[i];
    }
  };

  useEffect(() => {
    let animId: number;
    const startTime = performance.now() + index * 1000;

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // Organic multi-harmonic wave breathing
      const idleOffsets = new Array(POINT_COUNT);
      for (let i = 0; i < POINT_COUNT; i++) {
        const phaseShift = (i * 2 * Math.PI) / POINT_COUNT;
        const wave = Math.sin((elapsed * 2 * Math.PI) / 8 + phaseShift) * 10;
        idleOffsets[i] = wave;
      }

      const stiffness = 0.03;
      const damping = 0.8;

      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < POINT_COUNT; i++) {
        const targetRadius = targetRadiiRef.current[i] + idleOffsets[i];
        const force = (targetRadius - currentRadiiRef.current[i]) * stiffness;
        velocityRef.current[i] = (velocityRef.current[i] + force) * damping;
        currentRadiiRef.current[i] += velocityRef.current[i];

        const angle = (i * 2 * Math.PI) / POINT_COUNT;
        const r = currentRadiiRef.current[i];
        points.push({
          x: CENTER + r * Math.cos(angle),
          y: CENTER + r * Math.sin(angle),
        });
      }

      // Catmull-Rom spline interpolation
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
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col group relative"
    >
      <Link
        href={`/portfolio/${project.id}`}
        data-cursor="VIEW"
        className="block relative w-full"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full aspect-square max-w-[360px] mx-auto flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
        >
          {/* SVG Mask Definition */}
          <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
              <clipPath id={maskId} clipPathUnits="userSpaceOnUse">
                <path d={pathD} />
              </clipPath>
            </defs>
          </svg>

          {/* Soft Shadow Layer */}
          <div
            className="absolute inset-4 rounded-full pointer-events-none transition-all duration-700 bg-radial from-[#111111]/25 via-black/5 to-transparent blur-2xl group-hover:blur-3xl group-hover:scale-110"
            style={{ transform: "translateY(20px)" }}
          />

          {/* Multi-layered Ceramic Blob Frame */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          >
            <path
              d={pathD}
              fill="none"
              stroke="#FCFAF8"
              strokeWidth="24"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 10px 18px rgba(17,17,17,0.08))",
              }}
            />
            <path
              d={pathD}
              fill="none"
              stroke="rgba(183, 157, 137, 0.4)"
              strokeWidth="2"
            />
          </svg>

          {/* SVG Path Masked Image Container */}
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              clipPath: pathD ? `url(#${maskId})` : undefined,
              WebkitClipPath: pathD ? `url(#${maskId})` : undefined,
            }}
          >
            {/* Number Tag Top-Left inside image */}
            <div className="absolute top-8 left-8 z-20 font-mono text-xs font-light text-white/80 tracking-widest pointer-events-none">
              {project.num}
            </div>

            {/* Project Image with slow zoom and subtle rotation */}
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-112 group-hover:rotate-1"
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Glass Specular Reflection Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          </div>
        </div>

        {/* Project Metadata Below Blob Card */}
        <div className="mt-6 flex items-start justify-between px-2">
          <div>
            <h3 className="font-heading text-2xl font-light text-[#111111] tracking-tight group-hover:text-[#B79D89] transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] tracking-[0.18em] text-[#6F6F6F] font-semibold uppercase">
              <span>{project.location}</span>
              <span className="w-1 h-1 rounded-full bg-[#B79D89]" />
              <span>{project.category}</span>
            </div>
          </div>

          {/* Plus/Arrow Action Circle */}
          <div className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center text-[#111111] transition-all duration-300 group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111] shadow-xs" data-cursor-magnetic>
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function PortfolioGrid() {
  return (
    <section className="py-24 sm:py-36 bg-[#FCFAF8] relative z-20 select-none overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header Row: Title Left, View All Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-black/[0.08] pb-10">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#6F6F6F] uppercase block mb-3">
              OUR PORTFOLIO
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-[#111111] tracking-tight">
              Spaces That Inspire
            </h2>
          </div>

          <Link
            href="/portfolio"
            data-cursor-magnetic
            className="inline-flex items-center gap-3 text-xs tracking-[0.18em] font-semibold uppercase text-[#111111] transition-colors hover:text-[#B79D89] group"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Organic Sculptural Liquid Blob Cards in Asymmetrical Editorial Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 items-start">
          {PROJECTS.map((project, idx) => (
            <BlobProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

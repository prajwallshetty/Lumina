"use client";

import { useEffect, useRef, useState, useId } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

type LiquidBlobProps = {
  videoUrl?: string;
};

const LUXURY_INTERIOR_VIDEO =
  "https://assets.mixkit.co/videos/34487/34487-720.mp4";

// 32 control points for an ultra-smooth, organic Catmull-Rom sculpture curve
const POINT_COUNT = 32;
const SVG_SIZE = 780;
const CENTER = SVG_SIZE / 2;
const BASE_RADIUS = 290;

// 32-point organic asymmetry array
const ASYMMETRY = Array.from({ length: POINT_COUNT }, (_, i) => {
  const angle = (i * 2 * Math.PI) / POINT_COUNT;
  return 1 + Math.sin(angle * 3) * 0.05 + Math.cos(angle * 2) * 0.04;
});

export function LiquidBlob({ videoUrl = LUXURY_INTERIOR_VIDEO }: LiquidBlobProps) {
  const maskId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Heavy, buttery spring physics configurations
  const springConfig = { stiffness: 20, damping: 18 };
  const floatSpringConfig = { stiffness: 14, damping: 12 };

  // 3D perspective tilt tracking cursor
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  // Specular reflection position offset
  const reflectX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-160, 160]), springConfig);
  const reflectY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-160, 160]), springConfig);

  // Dynamic shadow offset reacting opposite to cursor
  const shadowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [40, -40]), springConfig);
  const shadowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [50, -50]), springConfig);

  // Orbiting elements parallax spring offsets
  const parallaxX_heavy = useSpring(useTransform(mouseX, [-0.5, 0.5], [-35, 35]), floatSpringConfig);
  const parallaxY_heavy = useSpring(useTransform(mouseY, [-0.5, 0.5], [-35, 35]), floatSpringConfig);
  const parallaxX_light = useSpring(useTransform(mouseX, [-0.5, 0.5], [25, -25]), floatSpringConfig);
  const parallaxY_light = useSpring(useTransform(mouseY, [-0.5, 0.5], [25, -25]), floatSpringConfig);

  // Handheld camera drift offset
  const [driftPos, setDriftPos] = useState({ x: 0, y: 0 });

  // Dynamic SVG path state
  const [pathD, setPathD] = useState("");
  const pathDRef = useRef("");

  // Target and current animated radii for 32 control points
  const targetRadiiRef = useRef<number[]>(new Array(POINT_COUNT).fill(BASE_RADIUS));
  const currentRadiiRef = useRef<number[]>(new Array(POINT_COUNT).fill(BASE_RADIUS));
  const velocityRef = useRef<number[]>(new Array(POINT_COUNT).fill(0));

  // Cursor wave ripple offsets
  const rippleOffsetsRef = useRef<number[]>(new Array(POINT_COUNT).fill(0));

  // Handle cursor interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cX = rect.left + rect.width / 2;
      const cY = rect.top + rect.height / 2;

      const normX = (e.clientX - cX) / window.innerWidth;
      const normY = (e.clientY - cY) / window.innerHeight;
      mouseX.set(normX);
      mouseY.set(normY);

      const distFromCenter = Math.hypot(e.clientX - cX, e.clientY - cY);
      const activeRadius = Math.max(rect.width, rect.height) * 0.85;
      const inZone = distFromCenter < activeRadius;

      setIsHovered(inZone);

      if (inZone) {
        const mouseAngle = Math.atan2(e.clientY - cY, e.clientX - cX);
        const mouseDistRatio = Math.min(distFromCenter / (rect.width / 2), 1.3);

        for (let i = 0; i < POINT_COUNT; i++) {
          const pointAngle = (i * 2 * Math.PI) / POINT_COUNT;
          let diff = Math.abs(pointAngle - mouseAngle);
          if (diff > Math.PI) diff = 2 * Math.PI - diff;

          // Closest edge deforms outward
          const pullFactor = Math.exp(-Math.pow(diff / 0.55, 2));
          const oppDiff = Math.abs(diff - Math.PI);
          const stretchFactor = Math.exp(-Math.pow(oppDiff / 0.55, 2));

          const pullOffset = pullFactor * 55 * mouseDistRatio;
          const stretchOffset = stretchFactor * 30 * mouseDistRatio;

          targetRadiiRef.current[i] =
            BASE_RADIUS * ASYMMETRY[i] + pullOffset + stretchOffset;

          // Ripple wave impulse along adjacent control points
          rippleOffsetsRef.current[i] = Math.sin(diff * 6) * 12 * pullFactor;
        }
      } else {
        // Elastic spring return on mouse leave
        for (let i = 0; i < POINT_COUNT; i++) {
          targetRadiiRef.current[i] = BASE_RADIUS * ASYMMETRY[i];
          rippleOffsetsRef.current[i] = 0;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // 60 FPS animation loop: 32-point Catmull-Rom spline interpolation + spring solver
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // 1. Handheld camera drift (2-4px low-frequency translation)
      const driftX = Math.sin(elapsed * 1.4) * 2.5;
      const driftY = Math.cos(elapsed * 1.1) * 1.8;
      setDriftPos({ x: driftX, y: driftY });

      // 2. 14s Idle Multi-harmonic Sine Wave Breathing for 32 points
      const idleOffsets = new Array(POINT_COUNT);
      for (let i = 0; i < POINT_COUNT; i++) {
        const phaseShift = (i * 2 * Math.PI) / POINT_COUNT;
        const wave1 = Math.sin((elapsed * 2 * Math.PI) / 14 + phaseShift) * 15;
        const wave2 = Math.cos((elapsed * 2 * Math.PI) / 9 + phaseShift * 2) * 8;
        idleOffsets[i] = wave1 + wave2;
      }

      // 3. Heavy Spring physics solver for 32 control points
      const stiffness = 0.022;
      const damping = 0.82;

      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < POINT_COUNT; i++) {
        const targetRadius =
          (isHovered ? targetRadiiRef.current[i] : BASE_RADIUS * ASYMMETRY[i]) +
          idleOffsets[i] +
          rippleOffsetsRef.current[i];

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

      // 4. Catmull-Rom Spline interpolation for 32 points (Smooth C1 continuity)
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
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      data-cursor="DRAG"
      className="relative w-full aspect-4/3 max-w-[840px] xl:max-w-[940px] mx-auto flex items-center justify-center select-none"
      style={{ perspective: "1800px" }}
    >
      {/* SVG ClipPath Mask Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id={maskId} clipPathUnits="userSpaceOnUse">
            <path d={pathD} />
          </clipPath>
        </defs>
      </svg>

      {/* 3D Main Sculpture Container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{
          scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        {/* Soft Ambient Occlusion Shadow */}
        <motion.div
          className="absolute inset-8 rounded-full pointer-events-none transition-all duration-700 bg-radial from-[#111111]/20 via-[#B79D89]/5 to-transparent"
          style={{
            x: shadowX,
            y: shadowY,
            filter: isHovered ? "blur(50px) brightness(1.05)" : "blur(60px)",
            opacity: isHovered ? 0.9 : 0.65,
            transform: "translateZ(-50px)",
          }}
        />

        {/* Dynamic Multi-layered Ceramic Frame */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        >
          {/* Ambient Occlusion Outer Stroke Shadow */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(17, 17, 17, 0.05)"
            strokeWidth="48"
            strokeLinejoin="round"
            className="blur-xs"
          />
          {/* Drop Shadow Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(17, 17, 17, 0.08)"
            strokeWidth="38"
            strokeLinejoin="round"
          />
          {/* Main Sculpted White Ceramic Frame */}
          <path
            d={pathD}
            fill="none"
            stroke="#FCFAF8"
            strokeWidth="32"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 12px 20px rgba(17,17,17,0.06))",
            }}
          />
          {/* Specular Outer Highlight Edge */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="14"
            strokeLinejoin="round"
          />
          {/* Dynamic Bronze Accent Outline */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(183, 157, 137, 0.35)"
            strokeWidth="2.5"
          />
        </svg>

        {/* SVG Path Masked Video Container */}
        <div
          className="w-full h-full relative"
          style={{
            clipPath: pathD ? `url(#${maskId})` : undefined,
            WebkitClipPath: pathD ? `url(#${maskId})` : undefined,
          }}
        >
          {/* Autoplay Loop Video with slow zoom and handheld drift */}
          <motion.div
            className="w-full h-full relative"
            style={{
              x: driftPos.x,
              y: driftPos.y,
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-[1.05]"
            />

            {/* Warm Architectural Color Grading Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#111111]/20 via-transparent to-[#B79D89]/20 mix-blend-soft-light pointer-events-none" />

            {/* Inner Glass Vignette Depth Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(17,17,17,0.26)] pointer-events-none" />

            {/* Dynamic Moving Glass Specular Highlight */}
            <motion.div
              className="absolute -inset-[50%] bg-gradient-to-br from-white/35 via-white/5 to-transparent pointer-events-none opacity-85"
              style={{
                x: reflectX,
                y: reflectY,
              }}
            />

            {/* Glass Edge Refraction & Caustic Shimmer */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.16]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7) 0%, transparent 60%), linear-gradient(135deg, rgba(183,157,137,0.3) 0%, transparent 100%)",
              }}
            />
          </motion.div>
        </div>

        {/* Orbiting 3D Ceramic & Glass Accents */}
        <motion.div
          className="absolute -top-6 left-12 w-14 h-14 rounded-full bg-gradient-to-br from-white via-[#FAF8F5] to-[#EAE6DF] shadow-[0_15px_32px_rgba(0,0,0,0.12)] border border-white/60 pointer-events-none"
          style={{
            x: parallaxX_heavy,
            y: parallaxY_heavy,
          }}
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white/70 to-transparent" />
        </motion.div>

        {/* DRAG TO EXPLORE Interactive Capsule */}
        <motion.div
          className="absolute top-16 right-4 sm:right-10 bg-white/95 backdrop-blur-md border border-black/10 rounded-full px-5 py-5 shadow-[0_15px_35px_rgba(17,17,17,0.08)] flex flex-col items-center justify-center text-center cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-105"
          data-cursor-magnetic
          style={{
            x: parallaxX_light,
            y: parallaxY_light,
          }}
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            y: { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
            rotate: { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
          }}
        >
          <div className="w-5 h-5 mb-1 text-[#111111] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-[0.18em] text-[#111111] uppercase leading-tight">
            Drag to<br />Explore
          </span>
        </motion.div>

        {/* Bottom-Right Clay Morphing Blob */}
        <motion.div
          className="absolute bottom-6 right-20 w-24 h-24 rounded-[40%_60%_70%_30%/50%_60%_40%_50%] bg-gradient-to-br from-white/95 via-[#F8F6F2] to-[#E6E2D8] shadow-[0_20px_45px_rgba(0,0,0,0.12)] border border-white/80 flex items-center justify-center pointer-events-auto cursor-pointer"
          data-cursor-magnetic
          style={{
            x: parallaxX_heavy,
            y: parallaxY_heavy,
          }}
          animate={{
            borderRadius: [
              "40% 60% 70% 30%/50% 60% 40% 50%",
              "60% 40% 30% 70%/40% 50% 60% 50%",
              "40% 60% 70% 30%/50% 60% 40% 50%",
            ],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-8 h-8 rounded-full bg-white/90 border border-black/5 flex items-center justify-center text-[#111111] shadow-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </motion.div>

        {/* Bottom-Left Pearl Particle */}
        <motion.div
          className="absolute bottom-8 left-16 w-10 h-10 rounded-full bg-gradient-to-tr from-white via-[#FAF6EE] to-[#DFD9CE] shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-white/70 pointer-events-none"
          style={{
            x: parallaxX_light,
            y: parallaxY_light,
          }}
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />

        {/* Center Target Interactive Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/90 border border-black/25 shadow-md flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
        </div>
      </motion.div>
    </div>
  );
}

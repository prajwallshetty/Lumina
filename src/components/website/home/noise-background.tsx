"use client";

import { motion } from "framer-motion";

export function NoiseBackground() {
  // 6 subtle ambient floating light particles
  const particles = [
    { id: 1, size: 300, top: "10%", left: "15%", delay: 0, duration: 18 },
    { id: 2, size: 450, top: "40%", left: "60%", delay: 3, duration: 24 },
    { id: 3, size: 250, top: "70%", left: "25%", delay: 6, duration: 20 },
    { id: 4, size: 380, top: "20%", left: "75%", delay: 2, duration: 22 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#FCFAF8]">
      {/* Warm beige primary aura gradient */}
      <div className="absolute -top-[20%] -right-[10%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full bg-radial from-[#B79D89]/12 via-[#B79D89]/4 to-transparent blur-3xl" />

      {/* Secondary subtle warmth gradient bottom-left */}
      <div className="absolute -bottom-[20%] -left-[10%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full bg-radial from-[#D4C3B5]/15 via-[#B79D89]/3 to-transparent blur-3xl" />

      {/* Floating ambient aura particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#B79D89]/8 blur-2xl"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.1, 0.95, 1],
            opacity: [0.4, 0.7, 0.4, 0.4],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Ultra-fine Noise SVG Filter Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-multiply">
        <filter id="hero-noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise-filter)" />
      </svg>
    </div>
  );
}

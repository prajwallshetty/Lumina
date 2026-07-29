"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CurvedVideo } from "./curved-video";
import { NoiseBackground } from "./noise-background";
import { StatsBanner } from "./stats-banner";

type HeroProps = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  primaryCta?: { label: string; href: string } | null;
  secondaryCta?: { label: string; href: string } | null;
  mediaUrl?: string | null;
};

const easeCustom = [0.16, 1, 0.3, 1] as const;

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  mediaUrl,
}: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const blobColRef = useRef<HTMLDivElement>(null);

  // Magnetic button positions
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);
  const [primaryBtnPos, setPrimaryBtnPos] = useState({ x: 0, y: 0 });

  const secondaryBtnRef = useRef<HTMLAnchorElement>(null);
  const [secondaryBtnPos, setSecondaryBtnPos] = useState({ x: 0, y: 0 });

  // GSAP ScrollTrigger parallax & scroll fade
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !textColRef.current || !blobColRef.current) return;

    const ctx = gsap.context(() => {
      // Fade text column upward on scroll
      gsap.to(textColRef.current, {
        y: -80,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 20%",
          scrub: 0.6,
        },
      });

      // Parallax scale on blob container
      gsap.to(blobColRef.current, {
        scale: 1.08,
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handlePrimaryMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!primaryBtnRef.current) return;
    const rect = primaryBtnRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
    setPrimaryBtnPos({ x, y });
  };

  const handleSecondaryMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!secondaryBtnRef.current) return;
    const rect = secondaryBtnRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
    setSecondaryBtnPos({ x, y });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-40 sm:pt-44 lg:pt-48 pb-12 flex flex-col justify-between overflow-hidden bg-[#FCFAF8] select-none"
    >
      {/* Abstract warm lighting & noise background */}
      <NoiseBackground />

      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-12 lg:px-16 z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center flex-1">
        {/* LEFT COLUMN: Large Editorial Serif Typography */}
        <div ref={textColRef} className="lg:col-span-5 flex flex-col justify-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeCustom }}
            className="mb-6 sm:mb-8"
          >
            <span className="text-[11px] sm:text-xs tracking-[0.25em] text-[#6F6F6F] uppercase font-semibold">
              {eyebrow ?? "ARCHITECTURAL INTERIORS"}
            </span>
          </motion.div>

          {/* 110px Headline matching reference image */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: easeCustom, delay: 0.08 }}
            className="font-heading text-[58px] sm:text-[84px] lg:text-[104px] xl:text-[110px] text-[#1A1A1A] font-light leading-[0.9] tracking-[-0.03em] mb-8"
          >
            {title ?? (
              <>
                Designing <br />
                Spaces, <br />
                <span className="italic font-normal">Elevating</span> <br />
                Lives<span className="text-[#B79D89]">.</span>
              </>
            )}
          </motion.h1>

          {/* Editorial Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeCustom, delay: 0.16 }}
            className="font-body text-sm sm:text-base text-[#6F6F6F] font-normal leading-relaxed max-w-[520px] mb-8 sm:mb-10"
          >
            {subtitle ??
              "We craft refined residential sanctuaries and architectural environments that blend quiet minimalism with sensory warmth and timeless craftsmanship."}
          </motion.p>

          {/* Primary & Secondary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeCustom, delay: 0.24 }}
            className="flex flex-wrap items-center gap-4 sm:gap-5 mb-10"
          >
            {/* Primary Button */}
            <motion.div
              animate={{ x: primaryBtnPos.x, y: primaryBtnPos.y }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
            >
              <Link
                ref={primaryBtnRef}
                href={primaryCta?.href ?? "/portfolio"}
                data-cursor-magnetic
                onMouseMove={handlePrimaryMouseMove}
                onMouseLeave={() => setPrimaryBtnPos({ x: 0, y: 0 })}
                className="inline-flex items-center gap-3 bg-[#111111] text-[#FCFAF8] px-7 py-4 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold transition-all duration-300 hover:bg-[#B79D89] hover:text-white shadow-md group"
              >
                <span>{primaryCta?.label ?? "VIEW OUR PROJECTS"}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Secondary Button */}
            <motion.div
              animate={{ x: secondaryBtnPos.x, y: secondaryBtnPos.y }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
            >
              <Link
                ref={secondaryBtnRef}
                href={secondaryCta?.href ?? "/contact?intent=consultation"}
                data-cursor-magnetic
                onMouseMove={handleSecondaryMouseMove}
                onMouseLeave={() => setSecondaryBtnPos({ x: 0, y: 0 })}
                className="inline-flex items-center gap-3 bg-[#F6F4F0] text-[#111111] border border-black/[0.08] px-7 py-4 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold transition-all duration-300 hover:bg-[#111111] hover:text-white group"
              >
                <span>{secondaryCta?.label ?? "PLAY SHOWREEL"}</span>
                <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-white/20">
                  ▶
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Sub-row: Scroll to Explore */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="flex items-center gap-4 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#6F6F6F]"
          >
            <button className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center text-[#111111] transition-all duration-300 hover:bg-[#111111] hover:text-white group" data-cursor-magnetic>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </button>
            <span>SCROLL TO EXPLORE</span>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 70% Width Hero Video Curved Card */}
        <div
          ref={blobColRef}
          className="lg:col-span-7 flex items-center justify-center relative w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: easeCustom, delay: 0.12 }}
            className="w-full flex items-center justify-center"
          >
            <CurvedVideo videoUrl={mediaUrl ?? undefined} />
          </motion.div>
        </div>
      </div>

      {/* BOTTOM 5-COLUMN STATS BANNER */}
      <StatsBanner />
    </section>
  );
}

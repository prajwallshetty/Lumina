"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";

type HeroProps = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  primaryCta?: { label: string; href: string } | null;
  secondaryCta?: { label: string; href: string } | null;
  mediaUrl?: string | null;
};

const ease = [0.16, 1, 0.3, 1] as const;

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9qnb21PlZ6bIhJq8JrHPaIHdC9vzoUuL57YciHKsqrsSl0o2gnEkJ1hvfHs1n977KKntPdRDbYVOCsIciuUgAx096yH24hz37k-iR55IdFnahM3OVE7TS0PaxVJJmKzJBECtOkpS01-tevZnn0xl1OMdrrCGZ1gbFktGbS7kbYLVc125UwiIUhV6i6RkhSMIv_j_PzqbgOUvtHVweXfGeyg98ceo1eU9Ws62V50WYcf0vSnFKk1t0hA";

export function Hero({ eyebrow, title, subtitle, primaryCta, secondaryCta, mediaUrl }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pb-40 overflow-hidden">
      <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Text Column */}
        <div className="lg:col-span-5 z-10">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-label-caps text-on-surface-variant block mb-6"
          >
            {eyebrow ?? "Luxury Interiors"}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            className="text-display-lg mb-8"
          >
            {title ?? (
              <>
                Designed
                <br />
                Around You
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="text-body-lg text-on-surface-variant max-w-md mb-10"
          >
            {subtitle ??
              "We create timeless, functional and beautiful spaces tailored to the way you live. Your sanctuary, refined through architectural precision and human warmth."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
          >
            <Link
              href={primaryCta?.href ?? "/portfolio"}
              className="bg-primary text-primary-foreground px-10 py-5 flex items-center gap-3 transition-all hover:gap-5 group"
            >
              <span className="text-label-caps">
                {primaryCta?.label ?? "View Our Projects"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full border border-outline flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Play className="h-4 w-4 fill-current" />
              </div>
              <span className="text-label-caps">
                {secondaryCta?.label ?? "Play Showreel"}
              </span>
            </button>
          </motion.div>
        </div>

        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-7 relative h-[500px] sm:h-[600px] lg:h-[800px] mt-12 lg:mt-0"
        >
          <div className="w-full h-full blob-mask relative">
            <Image
              src={mediaUrl || HERO_IMAGE}
              alt="Luxury modern living room with floor-to-ceiling windows"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 right-10 hidden lg:flex flex-col items-center gap-4 bg-surface px-6 py-8 rounded-full shadow-lg border border-outline-variant/30">
            <span
              className="text-label-caps text-[10px]"
              style={{ writingMode: "vertical-lr" }}
            >
              Scroll to Explore
            </span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

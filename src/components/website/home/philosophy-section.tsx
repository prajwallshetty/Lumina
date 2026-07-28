"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

type ProcessStep = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  specNo: string;
  materialTag: string;
  imageUrl: string;
  iconSvg: React.ReactNode;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Understand & Envision",
    subtitle: "DISCOVERY & CONCEPT",
    description:
      "We begin with deep sensory dialogue, uncovering your lifestyle, aesthetic aspirations, and spatial orientation to craft a bespoke architectural narrative.",
    specNo: "SPEC_NO. 0101",
    materialTag: "Spatial Moodboards & Light Models",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    iconSvg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
        <path d="M12 3v18M3 12h18" strokeWidth="0.8" />
        <path d="M12 7l3 5-3 5-3-5 3-5z" fill="currentColor" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Architectural Drafting",
    subtitle: "DESIGN & MATERIALS",
    description:
      "Spatial flows, custom millwork, tactile moodboards, and 3D architectural lighting models are meticulously developed down to the millimeter.",
    specNo: "SPEC_NO. 0204",
    materialTag: "Natural Marble & Fluted Brass",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop",
    iconSvg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 4h16v3H4z" fill="currentColor" fillOpacity="0.15" />
        <path d="M10 7v13h4V7" />
        <path d="M6 4v1.5M10 4v1.5M14 4v1.5M18 4v1.5" strokeWidth="1" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Craftsmanship & Build",
    subtitle: "TURNKEY EXECUTION",
    description:
      "Master artisans, stonemasons, and engineers execute the design with relentless perfection, translating drawings into living sanctuaries.",
    specNo: "SPEC_NO. 0308",
    materialTag: "Bespoke Millwork & Stonemasonry",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
    iconSvg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 21h16M6 21V9a6 6 0 0112 0v12" fill="currentColor" fillOpacity="0.1" />
        <path d="M10 21V11a2 2 0 014 0v10" />
      </svg>
    ),
  },
];

export function PhilosophySection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const currentStep = PROCESS_STEPS[activeStep];

  return (
    <section
      id="process"
      className="py-24 sm:py-36 scroll-mt-28 md:scroll-mt-36 bg-[#FCFAF8] border-t border-black/[0.08] relative z-20 select-none overflow-hidden"
    >
      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Editorial Text & Action */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            {/* Hand-drawn Architectural Logo Mark */}
            <div
              className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center mb-6 bg-black/[0.02]"
              data-cursor-magnetic
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 21v-8h6v8" />
              </svg>
            </div>

            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#6F6F6F] uppercase block mb-4">
              OUR METHODOLOGY
            </span>

            <h2 className="font-heading text-4xl sm:text-5xl font-light text-[#111111] leading-[1.1] tracking-tight mb-6">
              Every Detail, <br />
              Intentionally <br />
              <span className="italic font-normal">Crafted.</span>
            </h2>

            <p className="font-body text-xs sm:text-sm text-[#6F6F6F] leading-relaxed max-w-sm mb-8">
              From initial architectural sketch to hand-curated material selection, our four-stage process guarantees timeless elegance.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/about"
                data-cursor-magnetic
                className="inline-flex items-center gap-3 bg-[#111111] text-[#FCFAF8] px-7 py-3.5 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold transition-all duration-300 hover:bg-[#B79D89] hover:text-white shadow-md group"
              >
                <span>EXPLORE PROCESS</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* CENTER COLUMN: Dynamic Interactive Image with Cross-fade */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full h-[460px] sm:h-[520px] rounded-[32px] overflow-hidden shadow-2xl border border-black/[0.08] bg-[#111111]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.number}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentStep.imageUrl}
                    alt={currentStep.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Stage Counter Tag */}
              <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#B79D89]" />
                <span className="text-[10px] font-mono font-medium tracking-widest uppercase">
                  STAGE {currentStep.number} / 03
                </span>
              </div>

              {/* Dynamic Material Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4.5 rounded-2xl border border-black/10 flex items-center justify-between text-[#111111] shadow-lg">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-[#6F6F6F] font-mono tracking-wider uppercase">ARCHITECTURAL FOCUS</span>
                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#111111]">
                    {currentStep.materialTag}
                  </span>
                </div>
                <span className="text-[9px] text-[#B79D89] font-mono font-semibold bg-[#B79D89]/10 px-2.5 py-1 rounded-md">
                  {currentStep.specNo}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Step Cards with Smooth Indicator Line */}
          <div className="lg:col-span-4 flex flex-col justify-center pl-0 lg:pl-4 relative">
            <div className="relative flex">
              
              {/* Vertical Animated Indicator Line */}
              <div className="w-[3px] bg-black/10 rounded-full mr-6 relative overflow-hidden my-2 flex-shrink-0">
                <motion.div
                  className="w-full bg-[#B79D89] rounded-full"
                  initial={false}
                  animate={{
                    height: `${100 / PROCESS_STEPS.length}%`,
                    y: `${activeStep * 100}%`,
                  }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {/* Step Cards Stack */}
              <div className="space-y-4 flex-1">
                {PROCESS_STEPS.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={step.number}
                      onClick={() => setActiveStep(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveStep(idx);
                        }
                      }}
                      data-cursor-magnetic
                      className={`p-6 rounded-2xl border transition-all duration-400 cursor-pointer text-left relative overflow-hidden ${
                        isActive
                          ? "bg-white border-[#111111]/15 shadow-xl shadow-black/[0.05] translate-x-1"
                          : "bg-white/40 border-black/5 opacity-70 hover:opacity-100 hover:bg-white/80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Icon Circle */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isActive
                                ? "bg-[#111111] text-white shadow-md scale-105"
                                : "bg-black/[0.04] text-[#111111]"
                            }`}
                          >
                            {step.iconSvg}
                          </div>

                          <div>
                            <span
                              className={`text-[9px] font-mono tracking-widest font-bold block uppercase transition-colors ${
                                isActive ? "text-[#B79D89]" : "text-[#6F6F6F]"
                              }`}
                            >
                              {step.subtitle}
                            </span>
                            <h3 className="font-heading text-lg sm:text-xl font-light text-[#111111] tracking-tight">
                              {step.title}
                            </h3>
                          </div>
                        </div>

                        {/* Chevron Indicator */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "bg-[#B79D89]/15 text-[#B79D89]"
                              : "opacity-0 -translate-x-2"
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Expandable Description */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: isActive ? "auto" : 0,
                          opacity: isActive ? 1 : 0,
                          marginTop: isActive ? 12 : 0,
                        }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 border-t border-black/5 text-xs font-body text-[#6F6F6F] leading-relaxed">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

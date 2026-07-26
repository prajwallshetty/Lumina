"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronUp, ChevronDown } from "lucide-react";

type ProcessStep = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  // Custom hand-drawn architectural SVG icon path
  iconSvg: React.ReactNode;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Understand & Envision",
    subtitle: "DISCOVERY & CONCEPT",
    description: "We begin with deep sensory dialogue, uncovering your lifestyle, aesthetic aspirations, and spatial orientation to craft a bespoke architectural narrative.",
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        {/* Hand-drawn Compass & Circle */}
        <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
        <path d="M12 3v18M3 12h18" strokeWidth="0.8" />
        <path d="M12 7l3 5-3 5-3-5 3-5z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Architectural Drafting",
    subtitle: "DESIGN & MATERIALS",
    description: "Spatial flows, custom millwork, tactile moodboards, and 3D architectural lighting models are meticulously developed down to the millimeter.",
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        {/* Hand-drawn Ruler & T-Square */}
        <path d="M4 4h16v3H4z" />
        <path d="M10 7v13h4V7" />
        <path d="M6 4v1.5M10 4v1.5M14 4v1.5M18 4v1.5" strokeWidth="1" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Craftsmanship & Build",
    subtitle: "TURNKEY EXECUTION",
    description: "Master artisans, stonemasons, and engineers execute the design with relentless perfection, translating drawings into living sanctuaries.",
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        {/* Hand-drawn Sculptural Pillar & Arch */}
        <path d="M4 21h16M6 21V9a6 6 0 0112 0v12" />
        <path d="M10 21V11a2 2 0 014 0v10" />
      </svg>
    ),
  },
];

export function PhilosophySection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="process" className="py-24 sm:py-36 bg-[#FCFAF8] border-t border-black/[0.08] relative z-20 select-none overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: Bespoke By Design */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            {/* Hand-drawn Architectural Logo Mark */}
            <div className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center mb-6 bg-black/[0.02]" data-cursor-magnetic>
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

            <div>
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

          {/* CENTER COLUMN: Architectural Material Image */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full h-[460px] sm:h-[520px] rounded-[36px] overflow-hidden shadow-xl border border-black/[0.08]">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop"
                alt="Architectural Material Samples and Design Process"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Material Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-black/10 flex items-center justify-between text-[#111111]">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Natural Marble & Brass</span>
                <span className="text-[9px] text-[#6F6F6F] font-mono">SPEC_NO. 084</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Hand-Drawn Timeline Accordion with Animated Vertical Line */}
          <div className="lg:col-span-4 flex flex-col justify-center pl-0 lg:pl-6 relative">
            {/* Vertical Animated Line */}
            <div className="absolute left-[26px] top-6 bottom-6 w-[1.5px] bg-black/10 hidden sm:block">
              <motion.div
                className="w-full bg-[#B79D89] lg:!h-full"
                animate={{ height: `${((activeStep + 1) / PROCESS_STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="space-y-6 relative z-10">
              {PROCESS_STEPS.map((step, idx) => {
                const isOpen = activeStep === idx;
                return (
                  <div
                    key={step.number}
                    className={`p-6 rounded-2xl border transition-all duration-500 lg:bg-white lg:border-black/10 lg:shadow-xs lg:opacity-100 ${
                      isOpen
                        ? "bg-white border-black/10 shadow-lg shadow-black/[0.04]"
                        : "bg-transparent border-black/5 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div
                      onClick={() => setActiveStep(idx)}
                      className="flex items-center justify-between cursor-pointer lg:cursor-default group"
                      data-cursor-magnetic
                    >
                      <div className="flex items-center gap-4">
                        {/* Hand-drawn Icon Circle */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 lg:bg-[#111111] lg:text-white ${
                          isOpen ? "bg-[#111111] text-white" : "bg-black/[0.04] text-[#111111] group-hover:bg-[#B79D89] group-hover:text-white"
                        }`}>
                          {step.iconSvg}
                        </div>

                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-[#B79D89] font-bold block uppercase">
                            {step.subtitle}
                          </span>
                          <h3 className="font-heading text-xl font-light text-[#111111] tracking-tight lg:text-[#111111] group-hover:text-[#B79D89] transition-colors">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      {/* Accordion Toggle Circle (hidden on desktop) */}
                      <button className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-[#111111] transition-colors group-hover:bg-black group-hover:text-white lg:hidden">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Desktop View: Always fully open */}
                    <div className="hidden lg:block">
                      <p className="mt-4 pt-3 border-t border-black/5 text-xs font-body text-[#6F6F6F] leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Mobile View: Collapsible Accordion */}
                    <div className="lg:hidden">
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 pt-3 border-t border-black/5 text-xs font-body text-[#6F6F6F] leading-relaxed">
                              {step.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

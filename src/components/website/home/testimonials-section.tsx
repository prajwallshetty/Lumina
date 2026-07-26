"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Lumina Spaces transformed our architectural vision into a serene sanctuary. Their meticulous attention to sensory materials and quiet minimalism is unmatched in luxury design.",
    name: "Rohan & Aditi",
    role: "HOMEOWNERS — BENGALURU",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "A rare team that understands the poetry of light, space, and volume. From first sketch to final installation, the process was calm, transparent, and flawless.",
    name: "Arjun Mehra",
    role: "ENTREPRENEUR — MUMBAI",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "The result exceeds every expectation. Walking into our home feels like walking through a private gallery. Timeless craftsmanship at its absolute peak.",
    name: "Sneha Iyer",
    role: "HOMEOWNER — PUNE",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
  },
];

function TestimonialCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        perspective: 1000,
      }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="bg-white/85 backdrop-blur-xl border border-black/[0.08] p-8 sm:p-10 rounded-[32px] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full transition-shadow duration-500 hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.1)] group relative overflow-hidden"
      >
        {/* Soft Ambient Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-[#B79D89]/10 pointer-events-none" />

        <div className="relative z-10">
          <Quote className="h-8 w-8 text-[#B79D89]/40 mb-6 group-hover:text-[#B79D89] transition-colors duration-300" strokeWidth={1} />
          <p className="font-heading text-lg sm:text-xl font-light text-[#111111] leading-relaxed mb-8 italic">
            &ldquo;{t.quote}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-black/5">
          <div className="w-12 h-12 rounded-full overflow-hidden relative border border-black/10 shadow-xs">
            <Image
              src={t.avatar}
              alt={t.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold text-[#111111]">{t.name}</h4>
            <p className="text-[10px] tracking-[0.18em] text-[#6F6F6F] font-semibold uppercase">{t.role}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-36 bg-[#FCFAF8] relative z-20 select-none overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-16">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#6F6F6F] uppercase block mb-3">
            WHAT OUR CLIENTS SAY
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-[#111111] tracking-tight">
            Trusted by Those Who <span className="italic font-normal">Value Excellence</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

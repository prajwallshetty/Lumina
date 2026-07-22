"use client";

import { motion } from "framer-motion";

const LOGOS = ["GODREJ", "PRESTIGE", "BRIGADE", "PURAVANKARA", "ASSETZ", "SOBHA"];

export function ClientLogos() {
  return (
    <section className="py-12 border-y border-outline-variant/20 bg-surface-container-lowest">
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-between items-center gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        >
          <p className="text-label-caps basis-full lg:basis-auto text-center lg:text-left mb-4 lg:mb-0">
            Trusted by visionary clients
          </p>
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-12 flex-1">
            {LOGOS.map((name) => (
              <span key={name} className="font-bold tracking-tighter text-2xl font-heading">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "150+", label: "Projects Completed" },
  { value: "12+", label: "Years Experience" },
  { value: "95%", label: "Client Retention" },
  { value: "25+", label: "Design Awards" },
  { value: "Bespoke", label: "Crafted for You", isItalicSerif: true },
];

export function StatsBanner() {
  return (
    <div className="w-full bg-[#FCFAF8] border-t border-black/[0.08] py-10 sm:py-12 relative z-20">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-black/[0.08]">
          {stats.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col items-center text-center ${
                idx !== 0 ? "pt-6 sm:pt-0 sm:pl-6" : ""
              }`}
            >
              <span
                className={`text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] font-light mb-2 tracking-tight ${
                  item.isItalicSerif ? "font-heading italic font-normal text-[#1A1A1A]" : "font-heading"
                }`}
              >
                {item.value}
              </span>
              <span className="text-xs tracking-[0.08em] text-[#6F6F6F] font-body font-normal uppercase">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

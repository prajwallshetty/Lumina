"use client";

import { motion } from "framer-motion";
import { Home, BadgeCheck, Smile, Award } from "lucide-react";

const STATS = [
  { icon: Home, value: "150+", label: "Projects Completed" },
  { icon: BadgeCheck, value: "8+", label: "Years Experience" },
  { icon: Smile, value: "98%", label: "Client Satisfaction" },
  { icon: Award, value: "12", label: "Design Awards" },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="container-editorial">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`flex flex-col items-center text-center p-8 ${
                  i < STATS.length - 1
                    ? "border-r border-outline-variant/30"
                    : ""
                }`}
              >
                <Icon className="h-8 w-8 mb-6 text-on-surface-variant" strokeWidth={1.5} />
                <div className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-none mb-2">
                  {stat.value}
                </div>
                <span className="text-label-caps text-on-surface-variant">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

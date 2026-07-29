"use client";

import { motion } from "framer-motion";

type ClientBrand = {
  id?: string;
  name: string;
  logoUrl?: string | null;
};

const DEFAULT_LOGOS: ClientBrand[] = [
  { name: "V&RO Hospitality" },
  { name: "Badmaash" },
  { name: "Plan B" },
  { name: "Cafe Noir" },
  { name: "Sultanate of Shawarma" },
  { name: "Novakan" },
];

export function ClientLogos({ brands }: { brands?: ClientBrand[] }) {
  const logoList = brands && brands.length > 0 ? brands : DEFAULT_LOGOS;

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
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-12 flex-1">
            {logoList.map((item, idx) => (
              <span key={item.id || item.name || idx} className="font-bold tracking-tighter text-2xl font-heading">
                {item.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

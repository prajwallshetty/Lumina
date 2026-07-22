"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Residential", "Commercial", "Hospitality"];

const PROJECTS = [
  {
    title: "Luxe Haven",
    category: "Residential",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3j2glqaebV2cdxZRvJG5tSqWBMWUU1ntHxMV_CJjaSZAngKbmFG9nsEYSlPdn0iOZmyD_jYzhcq25HvrayZJBDFIB_HhKlukodkIivboMovF3jEsoNbB3gS0WwOcdHAFdbeAqptIGjnGwkR92G3UuVC_cE81ySVl22E-HWW9xoGMAKKLC2mqNYGz-5nFEAAaht5DYlytxOQwnLUBLwA3sjSv7n9g-uQAFwMoQ9psAd7qlu_KtjKSyoQ",
  },
  {
    title: "Modern Minimal",
    category: "Residential",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzVJ2eVYryW0JKQj805nshJv1O0JjHvK6GjJNYPmmsS-yelZUSmjO00gGkBT6emGSAzDxPJ6UVUWZhMuxQ2eu7HSTrKxQFhsWu9UmIPxxTa7_eWV7DoNGSdtrjXfhCzi6zB1WAx5SlKlEC7H_zKyiw4OFz1Oo9ZUQID4-Ncx0p5ofkXecEeulrDYCKY9TbG6tr3KEpYMPJhaMisSRPFxdYz0P2PyZRwHjwSdGyWlHdpefMWFLjaaVFdA",
  },
  {
    title: "The Ivory House",
    category: "Residential",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYG6tSmPqKIkAAGOaElK669D_OoyrhOsVLWOho70Gez_0hY0VYTy4m3jS4fQ7rMz9SmTRHcj-b2qcNI4mu_P2cazO4hqkhXluFCqrsdedp1jxrnu1BtJO14xht0aqWT4_ITTEOJwdsWq-S14A1zrCRHuSEhSv7V0zOkv_bzr0MFT9I-6vDBRBrdYj9GM0Dl7FqJNNIKp0Ww-eWfn6hkZlnQJpSzXB-cLXiEN9JKTUL-D_Msx1jzdl9Ig",
  },
  {
    title: "Workspace Aesthetics",
    category: "Commercial",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1ar_8JlOoz0CbKb1jiPIVTP3ZV-PrVOvmgFBbDOpoWYwZvPQRa8L1Tuh7JXwhfDzSnBiSHw3IQ6qb7_Amvlo-GehDqUmc7neNUYSmvcmfRMFq9P8lHojQdIa65G_5JoMIGVuRJbXnFj8v5TF9BbLCTdyH5KH_sGeMb8DMCmzZquaxC77gUGVpTZaumUXSU0WPKSP_FcaUHkTVEBWqKTHazHfzQCyqepxWMUJTLrw-wWEx47IRLKhs6w",
  },
];

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section className="py-20 lg:py-40 bg-surface-container-low">
      <div className="container-editorial">
        {/* Header with filter tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-label-caps text-on-surface-variant block mb-4">
              Our Portfolio
            </span>
            <h2 className="text-headline-lg">Spaces That Inspire</h2>
          </motion.div>

          <div className="flex gap-8 border-b border-outline-variant/30 pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-label-caps transition-colors pb-2 -mb-[10px] ${
                  activeCategory === cat
                    ? "text-primary border-b border-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface group cursor-pointer overflow-hidden rounded-sm transition-all hover:shadow-2xl"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex justify-between items-center">
                <div>
                  <h3 className="font-heading text-[20px] leading-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-label-caps text-[10px] text-on-surface-variant">
                    {project.category}
                  </p>
                </div>
                <div className="w-10 h-10 border border-outline-variant flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 flex justify-center">
          <button className="px-12 py-4 border border-primary text-label-caps hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-3">
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

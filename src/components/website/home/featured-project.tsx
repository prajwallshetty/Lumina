"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const FEATURED_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuABYBjZTB1pDRLCAnR0aQb7OJp2ha35qqSBBhtIhWgT3SDViWNYhO_rgX1JgBExFSJ1w6ggVdm85jcVLZazZ44tg3CJPbG05Z8PmdFVXCA9NueCPvj8yhEQmDGstYkXn27OiWqqxNRnDsBoLJkd2yldTtN8KKmSPWXUjCWScD3c0UalQbV9k9Py0yrl2l0XZIhowTnScVWdT-XI7crGMHjoVVRvbdKD8GvOej86ZnCLrVQW8riMF1AN2w";

export function FeaturedProject() {
  return (
    <section className="py-20 lg:py-40">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Text */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-label-caps text-on-surface-variant block mb-4">
              Featured Project
            </span>
            <h2 className="text-headline-lg mb-6">
              Oceanview
              <br />
              Residence
            </h2>
            <div className="flex items-center gap-2 text-on-surface-variant mb-6">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-label-caps">Mangalore, India</span>
            </div>
            <p className="text-body-md text-on-surface-variant mb-10 max-w-sm">
              A serene coastal home that opens up to the ocean and embraces
              natural light in every corner. Minimal textures meet organic
              fluidity.
            </p>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-3 text-label-caps group border-b border-outline pb-1 hover:border-primary"
            >
              Explore Project
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Progress indicator */}
            <div className="mt-16 flex items-center gap-4">
              <span className="text-label-caps font-bold">01</span>
              <div className="w-20 h-[1px] bg-outline-variant">
                <div className="w-1/3 h-full bg-primary" />
              </div>
              <span className="text-label-caps text-on-surface-variant">03</span>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="lg:col-span-8 relative"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aspect-[16/9] overflow-hidden rounded-lg relative">
              <Image
                src={FEATURED_IMAGE}
                alt="Luxury beachfront living space with glass walls facing the ocean"
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2">
              <button className="w-14 h-14 bg-surface flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="w-14 h-14 bg-surface flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const PHILOSOPHY_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCKpbL-z2B2-rbxlykxajcqKtkLRJWEkQEETdJ8UjlyhDz3qRZ1kzqKTKGpX3rd0M0JzvK7vNKuNUbUYn54y_y3gOI0ZbO2ka3qchpGOilT10GddymuMcCTK6fH2UUlvJ9Nt3rL1uE9KqgIlefltoAKbZ1nWmDgIyLxtEa2iItyszlyYchtaYuonW1_ucvKaPyijpNuePE-hbGmSLhVvUlHYCUIJQ4iK3psAyDElnw6WNDuE8V2bLyKVw";

export function PhilosophySection() {
  return (
    <section className="py-20 lg:py-40">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-40 items-center">
          {/* Text */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-label-caps text-on-surface-variant block mb-6">
              Our Philosophy
            </span>
            <h2 className="text-headline-lg mb-8 italic">
              Good design is invisible, but it changes{" "}
              <span className="not-italic opacity-50">everything.</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-10">
              We believe every space has the potential to elevate everyday
              living. Our designs are a reflection of your personality, crafted
              with purpose and precision. Minimalist doesn&apos;t mean cold; it
              means curated.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-label-caps group"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            className="lg:col-span-7 relative"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aspect-[16/9] overflow-hidden rounded-lg relative">
              <Image
                src={PHILOSOPHY_IMAGE}
                alt="Minimalist vignette with clay vase and bronze sculptural bowls"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 flex gap-2">
              <button className="w-14 h-14 bg-surface shadow-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="w-14 h-14 bg-surface shadow-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

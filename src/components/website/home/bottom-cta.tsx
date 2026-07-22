"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function BottomCta() {
  return (
    <section className="py-24">
      <div className="container-editorial">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-surface-container rounded-lg p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 border border-outline-variant/30"
        >
          <div className="flex items-start gap-8">
            {/* Decorative circle */}
            <div className="w-20 hidden lg:block opacity-30">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="w-full h-auto"
              >
                <circle cx="40" cy="40" r="38" />
                <circle cx="40" cy="40" r="28" />
                <circle cx="40" cy="40" r="18" />
              </svg>
            </div>
            <div>
              <h2 className="text-headline-lg mb-4">
                Let&apos;s Design
                <br />
                Your Dream Space
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-sm">
                Ready to bring your vision to life? Schedule a consultation with
                our design experts today.
              </p>
            </div>
          </div>

          <Link
            href="/contact?intent=consultation"
            className="bg-primary text-primary-foreground px-16 py-6 text-label-caps flex items-center gap-3 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-2xl shrink-0"
          >
            Book Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

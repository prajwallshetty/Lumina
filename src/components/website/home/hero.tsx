"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaContainer } from "@/components/shared/media-container";

type HeroProps = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  primaryCta?: { label: string; href: string } | null;
  secondaryCta?: { label: string; href: string } | null;
  mediaUrl?: string | null;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ eyebrow, title, subtitle, primaryCta, secondaryCta, mediaUrl }: HeroProps) {
  return (
    <section className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-6">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-eyebrow text-accent"
        >
          {eyebrow ?? "Interior Design Studio"}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="text-display text-balance"
        >
          {title ?? "Considered spaces, crafted for the way you live."}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.12 }}
          className="max-w-xl text-lg text-muted-foreground"
        >
          {subtitle ??
            "We design and deliver turnkey interiors — residential and commercial — with a rigour for detail and a love of materials that endure."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.18 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg" variant="accent">
            <Link href={primaryCta?.href ?? "/contact?intent=consultation"}>
              <CalendarCheck className="h-5 w-5" />
              {primaryCta?.label ?? "Book a consultation"}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={secondaryCta?.href ?? "/portfolio"}>
              {secondaryCta?.label ?? "View our work"}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease }}
      >
        <MediaContainer
          src={mediaUrl}
          alt="Featured interior"
          aspect="aspect-[4/5]"
          label="Hero media"
          priority
          rounded="rounded-2xl"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </motion.div>
    </section>
  );
}

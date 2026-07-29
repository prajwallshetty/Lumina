"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis once on mount
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle route transitions & text reveal observer
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      // Instantly scroll to top on route change
      lenis.scrollTo(0, { immediate: true });
      // Request Lenis to recalculate container dimensions after page renders
      const timer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Handle automatic text scroll reveal animations
  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    // Target content text elements, avoiding elements marked with .no-reveal
    const elements = mainElement.querySelectorAll(
      "h1:not(.no-reveal), h2:not(.no-reveal), h3:not(.no-reveal), h4:not(.no-reveal), h5:not(.no-reveal), h6:not(.no-reveal), p:not(.no-reveal)"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before element reaches center
      }
    );

    elements.forEach((el) => {
      // Exclude hero sections, headers, footers, or already animated components
      const isHero = el.closest("section.relative.min-h-screen") || el.closest(".hero");
      const isHeaderFooter = el.closest("header") || el.closest("footer");
      const isMotion = el.closest("[data-motion]") || el.className.includes("motion-");

      if (!isHero && !isHeaderFooter && !isMotion) {
        if (!el.classList.contains("scroll-reveal-item")) {
          el.classList.add("scroll-reveal-item");
        }
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}

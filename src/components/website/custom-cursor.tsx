"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "magnetic" | "drag">("default");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth buttery spring physics
  const springConfig = { stiffness: 400, damping: 28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop/mouse)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Check element under cursor for attributes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      const magneticEl = target.closest("[data-cursor-magnetic]") as HTMLElement | null;

      if (cursorEl) {
        const text = cursorEl.getAttribute("data-cursor") || "";
        setCursorText(text);
        if (text === "DRAG" || text === "REVEAL") {
          setCursorVariant("drag");
        } else {
          setCursorVariant("hover");
        }
      } else if (magneticEl) {
        setCursorText("");
        setCursorVariant("magnetic");
      } else {
        setCursorText("");
        setCursorVariant("default");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  const variants = {
    default: {
      width: 14,
      height: 14,
      backgroundColor: "#111111",
      border: "1px solid rgba(255,255,255,0.4)",
      mixBlendMode: "difference" as const,
      opacity: 0.85,
    },
    hover: {
      width: 72,
      height: 72,
      backgroundColor: "#FCFAF8",
      border: "1px solid rgba(17,17,17,0.12)",
      mixBlendMode: "normal" as const,
      opacity: 0.96,
      boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
    },
    drag: {
      width: 80,
      height: 80,
      backgroundColor: "#111111",
      border: "1px solid rgba(255,255,255,0.2)",
      mixBlendMode: "normal" as const,
      opacity: 0.95,
      boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    },
    magnetic: {
      width: 44,
      height: 44,
      backgroundColor: "rgba(183,157,137,0.15)",
      border: "1.5px solid #B79D89",
      mixBlendMode: "normal" as const,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      animate={cursorVariant}
      variants={variants}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      {cursorText && (
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          className={`text-[9px] font-bold tracking-[0.2em] uppercase text-center px-1 ${
            cursorVariant === "drag" ? "text-white" : "text-[#111111]"
          }`}
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}

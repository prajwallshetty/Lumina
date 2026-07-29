"use client";

import { useEffect, useRef, useState, useId } from "react";

type LiquidBlobProps = {
  videoUrl?: string;
};

const LUXURY_INTERIOR_VIDEO =
  "/luminahero.mp4";

const POINT_COUNT = 16;
const SVG_WIDTH = 1800;
const SVG_HEIGHT = 1125; // 16:10 to match the container aspect ratio below
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;

// Base radii sized proportionally for the 16:10 canvas - safely within boundaries to prevent edge clipping
const BASE_RADIUS_X = 580;
const BASE_RADIUS_Y = 350;

// Portfolio 01 ("The Ivory House") organic liquid blob asymmetry mapping
const ASYMMETRY = [
  1.12, 1.10, 0.96, 0.90, 0.94, 1.08, 1.12, 1.05,
  0.94, 0.90, 0.95, 1.08, 1.12, 1.06, 0.95, 0.90,
];

// Two independent slow wobble harmonics per point, out of phase with the
// breathing wave, so the idle motion never looks like a single repeating loop.
const WOBBLE_PERIOD_A = 12; // seconds
const WOBBLE_PERIOD_B = 7.3; // seconds, deliberately non-integer vs A

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function LiquidBlob({ videoUrl = LUXURY_INTERIOR_VIDEO }: LiquidBlobProps) {
  const maskId = useId();
  const gooId = useId();
  const sheenId = useId();
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const rimPathRef = useRef<SVGPathElement>(null);
  const sheenRef = useRef<SVGEllipseElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const reducedMotion = usePrefersReducedMotion();

  const currentFactorsRef = useRef<number[]>([...ASYMMETRY]);
  const targetFactorsRef = useRef<number[]>([...ASYMMETRY]);
  const velocityRef = useRef<number[]>(new Array(POINT_COUNT).fill(0));
  const rotationRef = useRef(0);
  const globalSpinRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const pointerActiveRef = useRef(false);

  // Whole-blob magnetic drift: the entire shape leans toward the pointer,
  // on top of the per-point edge deformation, so it reads as attraction
  // rather than just a local dent.
  const centerOffsetRef = useRef({ x: 0, y: 0 });
  const targetCenterOffsetRef = useRef({ x: 0, y: 0 });
  const centerVelocityRef = useRef({ x: 0, y: 0 });

  // Momentary squeeze-and-release pulse triggered on click/tap; decays
  // each frame in the animation loop for a quick magnetic "snap".
  const pulseRef = useRef(0);

  const setTargetsFromPointer = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;

    const dx = clientX - cX;
    const dy = clientY - cY;
    const pointerAngle = Math.atan2(dy, dx);
    const distFromCenter = Math.hypot(dx, dy);
    // Limit pull reach and drift factor to prevent any clipping on margins
    const distRatio = Math.min(distFromCenter / (rect.width / 2), 1.0);

    for (let i = 0; i < POINT_COUNT; i++) {
      const pointAngle = (i * 2 * Math.PI) / POINT_COUNT;
      let diff = Math.abs(pointAngle - pointerAngle);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;

      const pullFactor = Math.exp(-Math.pow(diff / 0.95, 2));
      const pullOffset = pullFactor * 0.16 * distRatio;

      targetFactorsRef.current[i] = ASYMMETRY[i] + pullOffset;
    }

    // The whole silhouette leans toward the cursor with a limited pull
    const maxDrift = 0.06;
    const driftStrength = Math.min(distFromCenter / (rect.width / 2), 1) * maxDrift;
    const norm = distFromCenter || 1;
    targetCenterOffsetRef.current = {
      x: (dx / norm) * driftStrength * BASE_RADIUS_X,
      y: (dy / norm) * driftStrength * BASE_RADIUS_Y,
    };
  };

  const resetTargets = () => {
    for (let i = 0; i < POINT_COUNT; i++) {
      targetFactorsRef.current[i] = ASYMMETRY[i];
    }
    targetCenterOffsetRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    pointerActiveRef.current = true;
    setTargetsFromPointer(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    pointerActiveRef.current = false;
    resetTargets();
  };

  const handlePointerDown = () => {
    if (reducedMotion) return;
    pulseRef.current = 1;
  };

  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const dt = lastTimeRef.current === null ? 1 / 60 : (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      // Clamp dt so a dropped frame or tab-refocus doesn't cause a visible jolt.
      const clampedDt = Math.min(dt, 1 / 20);
      const dtScale = clampedDt / (1 / 60);

      const idleAmplitude = reducedMotion ? 0.004 : 0.028;

      // Click/tap pulse: a brief extra squeeze that snaps back out, decaying
      // exponentially so it never needs manual resetting.
      pulseRef.current *= Math.pow(0.9, dtScale);
      const pulse = pulseRef.current;

      // Slow continuous spin of the whole point ring — keeps the surface
      // alive even when the pointer never touches it.
      if (!reducedMotion) {
        globalSpinRef.current += 0.00035 * dtScale;
      }
      const spin = globalSpinRef.current;

      // Magnetic center-of-mass drift toward the pointer, springing back
      // to rest when the pointer leaves.
      {
        const stiffness = 0.045 * dtScale;
        const damping = Math.pow(0.82, dtScale);
        const fx = (targetCenterOffsetRef.current.x - centerOffsetRef.current.x) * stiffness;
        const fy = (targetCenterOffsetRef.current.y - centerOffsetRef.current.y) * stiffness;
        centerVelocityRef.current.x = (centerVelocityRef.current.x + fx) * damping;
        centerVelocityRef.current.y = (centerVelocityRef.current.y + fy) * damping;
        centerOffsetRef.current.x += centerVelocityRef.current.x;
        centerOffsetRef.current.y += centerVelocityRef.current.y;
      }
      const cx = CENTER_X + centerOffsetRef.current.x;
      const cy = CENTER_Y + centerOffsetRef.current.y;

      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < POINT_COUNT; i++) {
        const phaseShift = (i * 2 * Math.PI) / POINT_COUNT;
        const waveA = Math.sin((elapsed * 2 * Math.PI) / WOBBLE_PERIOD_A + phaseShift);
        const waveB = Math.sin((elapsed * 2 * Math.PI) / WOBBLE_PERIOD_B - phaseShift * 1.7);
        const waveC = Math.cos((elapsed * 2 * Math.PI) / 5.2 + phaseShift * 2.3);
        const idleOffset = (waveA * 0.5 + waveB * 0.3 + waveC * 0.2) * idleAmplitude;

        // Pulse briefly pinches alternating points in and out for a snappy
        // squeeze rather than a uniform inflate/deflate.
        const pulseOffset = pulse * 0.1 * Math.cos((i * 2 * Math.PI * 2) / POINT_COUNT);

        const targetFactor = targetFactorsRef.current[i] + idleOffset + pulseOffset;

        // Snappier, slightly underdamped spring so the magnetic pull has a
        // touch of elastic overshoot instead of settling flatly.
        const stiffness = 0.05 * dtScale;
        const damping = Math.pow(0.84, dtScale);

        const force = (targetFactor - currentFactorsRef.current[i]) * stiffness;
        velocityRef.current[i] = (velocityRef.current[i] + force) * damping;
        currentFactorsRef.current[i] += velocityRef.current[i];

        const angle = (i * 2 * Math.PI) / POINT_COUNT + spin;
        const mult = currentFactorsRef.current[i];

        points.push({
          x: cx + BASE_RADIUS_X * mult * Math.cos(angle),
          y: cy + BASE_RADIUS_Y * mult * Math.sin(angle),
        });
      }

      // Catmull-Rom Spline interpolation for a seamless liquid shape
      let d = "";
      const len = points.length;
      const tension = 1.0;

      for (let i = 0; i < len; i++) {
        const p0 = points[(i - 1 + len) % len];
        const p1 = points[i];
        const p2 = points[(i + 1) % len];
        const p3 = points[(i + 2) % len];

        const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
        const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
        const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
        const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

        if (i === 0) {
          d += `M ${p1.x.toFixed(2)},${p1.y.toFixed(2)} `;
        }
        d += `C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)} `;
      }
      d += "Z";

      // Write directly to the DOM instead of React state — avoids a
      // component re-render on every animation frame.
      if (pathRef.current) pathRef.current.setAttribute("d", d);
      if (rimPathRef.current) rimPathRef.current.setAttribute("d", d);

      // Shadow lags slightly behind the blob's lean (a fraction of the
      // offset, and eased) so the drift reads as weight shifting, not the
      // whole graphic sliding uniformly.
      if (shadowRef.current) {
        const shadowX = (centerOffsetRef.current.x / BASE_RADIUS_X) * 5;
        const shadowY = 4 + (centerOffsetRef.current.y / BASE_RADIUS_Y) * 5;
        shadowRef.current.style.transform = `translate(${shadowX.toFixed(2)}%, ${shadowY.toFixed(2)}%)`;
      }

      // A slow, near-imperceptible drift of the specular highlight gives the
      // surface a sense of liquid depth rather than a static painted-on sheen.
      if (sheenRef.current && !reducedMotion) {
        rotationRef.current += 0.0015 * dtScale;
        const sx = cx - BASE_RADIUS_X * 0.32 + Math.sin(rotationRef.current) * 40;
        const sy = cy - BASE_RADIUS_Y * 0.38 + Math.cos(rotationRef.current * 0.8) * 24;
        sheenRef.current.setAttribute("cx", sx.toFixed(1));
        sheenRef.current.setAttribute("cy", sy.toFixed(1));
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className={`relative w-full aspect-[16/10] max-w-[1700px] xl:max-w-[2000px] 2xl:max-w-[2300px] max-h-[88vh] mx-auto flex items-center justify-center select-none cursor-pointer liquid-blob-container-${rawId}`}
    >
      {/* Soft Ambient Shadow behind Blob */}
      <div
        ref={shadowRef}
        className="absolute inset-6 rounded-full pointer-events-none bg-radial from-[#111111]/15 via-[#B79D89]/10 to-transparent blur-3xl"
        style={{ transform: "translateY(4%)" }}
      />

      {/* Single 16:9 Widescreen Liquid Blob Video Canvas without Borders */}
      <svg
        aria-hidden="true"
        className="w-full h-full overflow-visible pointer-events-auto"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      >
        <defs>
          <mask id={maskId}>
            <path ref={pathRef} d="" fill="white" filter={`url(#${gooId})`} />
          </mask>

          {/* Softens the vector edge into a slightly liquid, non-mechanical
              boundary rather than a razor-sharp SVG clip. */}
          <filter id={gooId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurred" />
            <feColorMatrix
              in="blurred"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 22 -9"
            />
          </filter>

          <radialGradient id={sheenId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g>
          {/* Masked Video */}
          <g mask={`url(#${maskId})`}>
            <foreignObject x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT}>
              <div className="w-full h-full relative overflow-hidden bg-[#111111]">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`liquid-blob-video-${rawId} w-full h-full object-cover scale-[1.04]`}
                />
                {/* Subtle Color Grading Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#111111]/20 via-transparent to-[#B79D89]/15 mix-blend-soft-light pointer-events-none" />
              </div>
            </foreignObject>
          </g>

          {/* Thin rim light traces the liquid edge, giving it a glass-like lip
              rather than a flat cutout. */}
          <path
            ref={rimPathRef}
            d=""
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.22"
            strokeWidth="2.5"
            filter={`url(#${gooId})`}
          />
        </g>

        {/* Specular highlight drifting slowly across the surface, blended so
            it reads as light on liquid rather than a flat decal. */}
        <g mask={`url(#${maskId})`} style={{ mixBlendMode: "soft-light" }}>
          <ellipse
            ref={sheenRef}
            cx={CENTER_X - BASE_RADIUS_X * 0.32}
            cy={CENTER_Y - BASE_RADIUS_Y * 0.38}
            rx={BASE_RADIUS_X * 0.55}
            ry={BASE_RADIUS_Y * 0.5}
            fill={`url(#${sheenId})`}
          />
        </g>
      </svg>

      <style>{`
        .liquid-blob-container-${rawId} {
          animation: liquid-blob-float-${rawId} 18s ease-in-out infinite;
        }
        .liquid-blob-video-${rawId} {
          transition: transform 700ms ease-out;
          animation: liquid-blob-drift-${rawId} 20s ease-in-out infinite;
        }
        @keyframes liquid-blob-float-${rawId} {
          0%   { transform: translateY(0px) rotate(0deg); }
          33%  { transform: translateY(-8px) translateX(4px) rotate(0.4deg); }
          66%  { transform: translateY(6px) translateX(-4px) rotate(-0.4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes liquid-blob-drift-${rawId} {
          0%   { transform: scale(1.04) translate(0, 0); }
          50%  { transform: scale(1.10) translate(-1.2%, -1.2%); }
          100% { transform: scale(1.04) translate(0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .liquid-blob-container-${rawId} {
            animation: none;
          }
          .liquid-blob-video-${rawId} {
            animation: none;
            transform: scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}
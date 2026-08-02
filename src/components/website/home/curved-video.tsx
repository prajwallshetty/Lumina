"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

type CurvedVideoProps = {
  videoUrl?: string;
};

const DEFAULT_VIDEO = "/luminahero.mp4";

export function CurvedVideo({ videoUrl = DEFAULT_VIDEO }: CurvedVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoUrls = videoUrl.split(",").filter(Boolean);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const currentVideoUrl = videoUrls[activeVideoIndex] || DEFAULT_VIDEO;

  // Load and play when active video index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeVideoIndex]);

  const handleVideoEnded = () => {
    if (videoUrls.length > 1) {
      setActiveVideoIndex((prev) => (prev + 1) % videoUrls.length);
    }
  };

  // Auto-pause video when scrolled out of viewport to conserve CPU/GPU
  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;
    const videoEl = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoEl.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 0;
    setCurrentTime(current);
    setDuration(total);
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Sync mute state on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      className="relative w-full aspect-[16/10] max-w-[1700px] xl:max-w-[2000px] 2xl:max-w-[2300px] max-h-[88vh] mx-auto flex items-center justify-center cursor-pointer select-none group"
    >
      {/* Luxury double shadow & ambient glow backing */}
      <div className="absolute -inset-1 rounded-[34px] sm:rounded-[42px] md:rounded-[54px] bg-gradient-to-tr from-[#B79D89]/15 via-transparent to-[#B79D89]/5 opacity-60 blur-xl pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-4 rounded-[28px] sm:rounded-[36px] md:rounded-[48px] shadow-[0_24px_54px_-16px_rgba(27,32,52,0.18)] pointer-events-none group-hover:shadow-[0_32px_64px_-12px_rgba(27,32,52,0.26)] transition-all duration-700" />

      {/* Main Curved Card Frame */}
      <div className="relative w-full h-full overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[48px] border border-black/[0.07] dark:border-white/[0.08] bg-neutral-950 transition-transform duration-700 ease-out-expo group-hover:scale-[1.012]">
        
        {/* Double Inner Glow Borders */}
        <div className="absolute -inset-px rounded-[28px] sm:rounded-[36px] md:rounded-[48px] border border-black/[0.05] dark:border-white/[0.05] pointer-events-none z-10" />
        <div className="absolute inset-px rounded-[27px] sm:rounded-[35px] md:rounded-[47px] border border-white/5 pointer-events-none z-10" />

        {/* Cinematic Video Layer */}
        <div className="relative w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            src={currentVideoUrl}
            autoPlay
            muted
            loop={videoUrls.length <= 1}
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover scale-100 transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.04]"
          />
        </div>

        {/* Fine Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 opacity-90 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none z-0" />

        {/* TOP PANEL: Brand & Live Tag */}
        <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 z-10 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] tracking-[0.2em] font-semibold text-white/95 font-label uppercase">
            LUMINA SHOWREEL
          </span>
          <div className="flex items-center gap-2 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B79D89] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B79D89]"></span>
            </span>
            <span className="text-[8.5px] font-mono tracking-widest text-white/80 font-bold uppercase">
              CINEMATIC
            </span>
          </div>
        </div>

        {/* BOTTOM PANEL: Editorial Caption, Timer, and Mute Control */}
        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-10 flex items-end justify-between">
          <div className="flex flex-col gap-1.5 pointer-events-none text-left">
            <span className="text-[10px] tracking-[0.25em] font-bold text-[#B79D89] font-label uppercase">
              {videoUrls.length > 1 ? `SHOWREEL VIDEO ${activeVideoIndex + 1} OF ${videoUrls.length}` : "01 / SIGNATURE PORTFOLIO"}
            </span>
            <h3 className="font-heading text-lg sm:text-2xl font-light text-white tracking-wide leading-none">
              {videoUrls.length > 1 ? `Presentation ${activeVideoIndex + 1}` : "Masco Grandeur"}
            </h3>
            <span className="text-[10px] text-white/50 font-mono mt-1">
              {formatTime(currentTime)} — {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {videoUrls.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideoIndex((prev) => (prev - 1 + videoUrls.length) % videoUrls.length);
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-md cursor-pointer"
                  title="Previous video"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideoIndex((prev) => (prev + 1) % videoUrls.length);
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-md cursor-pointer"
                  title="Next video"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Elegant Floating Mute Control */}
            <button
              type="button"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-md cursor-pointer"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Play/Pause state indicators on hover/click */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isPlaying ? 0 : 0.9, scale: isPlaying ? 0.8 : 1 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black shadow-2xl"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </motion.div>
        </div>

        {/* SLEEK PROGRESS TIMELINE BAR */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10 pointer-events-none z-10">
          <div
            className="h-full bg-gradient-to-r from-[#B79D89] to-[#E9D9CC] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </div>
  );
}

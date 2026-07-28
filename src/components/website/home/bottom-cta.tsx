"use client";

import { useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { subscribeNewsletter } from "@/actions/newsletter.actions";
import { toast } from "sonner";

export function BottomCta() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await subscribeNewsletter({ email });
      if (!res.ok) throw new Error(res.error);
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <section className="py-24 bg-[#FCFAF8] relative z-20 select-none overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Soft Warm Floating Ambient Background Blobs */}
        <div className="relative w-full bg-[#FAF7F2] rounded-[40px] p-10 sm:p-16 lg:p-20 border border-black/[0.06] shadow-xl overflow-hidden">
          {/* Floating Blob 1 */}
          <motion.div
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#B79D89]/15 blur-3xl pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating Blob 2 */}
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#111111]/5 blur-3xl pointer-events-none"
            animate={{
              scale: [1.1, 0.9, 1.1],
              y: [0, -30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Headline & Content */}
            <div className="lg:col-span-6">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#6F6F6F] uppercase block mb-3">
                THE LUMINA JOURNAL
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-light text-[#111111] leading-tight tracking-tight mb-4">
                Stay <span className="italic font-normal">Inspired.</span>
              </h2>
              <p className="font-body text-xs sm:text-sm text-[#6F6F6F] leading-relaxed max-w-md">
                Subscribe to receive private invitations to architectural project debuts, design essays, and material stories.
              </p>
            </div>

            {/* Right Newsletter Glass Input Form */}
            <div className="lg:col-span-6">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-black/10 text-center"
                >
                  <p className="font-heading text-lg text-[#111111] font-medium">
                    Thank you for subscribing.
                  </p>
                  <p className="text-xs text-[#6F6F6F] mt-1">
                    Welcome to the Lumina Spaces inner circle.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-full">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6F6F6F]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full bg-white/90 backdrop-blur-md border border-black/10 rounded-full pl-12 pr-6 py-4 text-xs font-body text-[#111111] placeholder:text-[#6F6F6F]/60 focus:outline-none focus:border-[#B79D89] transition-colors shadow-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    data-cursor-magnetic
                    className="w-full sm:w-auto whitespace-nowrap bg-[#111111] text-white px-8 py-4 rounded-full text-[11px] tracking-[0.16em] uppercase font-bold transition-all duration-300 hover:bg-[#B79D89] shadow-md group flex items-center justify-center gap-2"
                  >
                    <span>SUBSCRIBE</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

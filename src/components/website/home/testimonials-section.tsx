"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Lumina Spaces transformed our house into a home. Their attention to detail and understanding of our vision was exceptional. The result is a space that feels uniquely ours but elevated to a professional standard.",
    name: "Ananya & Rohan",
    role: "Homeowners",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDzUoQtLHB7iHEBJEFgyUItLn9fTKlsixSug_X5b-yYL_hSA3nKKb7OMtwVdEfyRKQFs6m2Y4sckae6o8N98JL6BXr8x17jLkZiLFWWCAQCr-IvZyqREanf97yQl1sW0SABbs1XVm7kX5Qlseu5xP4jJBff0L64xrisTtXy4NDLVFLsekba3M_MOQzOHYzIq0iY-ESIVUL0m5EaT600Z1k25rQIy2x6NcxWy8OWi469SwoMnvacdKUAg",
  },
  {
    quote:
      "A seamless experience from concept to completion. The team is professional, creative and truly passionate about what they do. They handled every challenge with grace and delivered on time.",
    name: "Vikram Shetty",
    role: "Business Owner",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2xQHmrOPjTL0F5-FJPzwFl0ExU_X1NW_bxAl4Uy4AnE5B7fb7CxQS0q3KzCEtyQ8Qf6XLSE-EM5pEWKVxPYF1wOcjuwFni-SYhhJoJPLNL-uVIco6QHe42pDQoNa9BRe3EjrSTp5TbNEnE6OztGUA07hcqJiiD3FeRf26riGZRUmSYAudWHcTUkFl2_wCVxgU7uyWoSUV3rW_qldnDvugsaHRz0Qd4ZEj0wXQviNR-sR1h2wpg2SsiA",
  },
  {
    quote:
      "They designed our office space beautifully! It's functional, modern and has improved our work environment greatly. The feedback from our clients and employees has been overwhelmingly positive.",
    name: "Neha Rao",
    role: "Director, NR Co.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFkuC7d6fVdmGPwPSM2uXEUSYkpxYo7W0W1ohshwUyv7IPBGMVUeD4cvxXMk3EAgGnlpPXmMM5yyUNVV0G5x6qd04psaUxNfKpyv2seGy0zFFczVLfPwBsyvD2o9row88qZ7UEJJQrkLerOBlGEDu0zusFdrJSFKb-olQj8HuDduyskm5Cr22r4ATerKO6cLmgMMgbK7GXX-jHljoRyMb5vJ01eJ1OMottYLJaFbksFMYHR349vb291g",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-40 bg-surface-container-low">
      <div className="container-editorial">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-label-caps text-on-surface-variant block mb-4">
            Clients Love
          </span>
          <h2 className="text-headline-lg">
            Words That
            <br />
            Inspire Us
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-surface p-10 flex flex-col justify-between rounded-sm h-full"
            >
              <div>
                <Quote className="h-10 w-10 text-outline-variant mb-6" strokeWidth={1} />
                <p className="text-body-md mb-8 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-label-caps font-bold">{t.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

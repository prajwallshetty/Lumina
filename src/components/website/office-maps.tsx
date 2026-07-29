"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const OFFICES = [
  {
    name: "Bangalore Office",
    address: "Lumina Spaces, Bangalore, Karnataka",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.1999317705095!2d77.62402110000001!3d13.0229366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1700119b86db%3A0x882ffd7ef45199d7!2sLumina%20Spaces!5e0!3m2!1sen!2sin!4v1785297158925!5m2!1sen!2sin",
  },
  {
    name: "Mangalore Office",
    address: "Lumina Spaces, Mangalore, Karnataka",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5776414697716!2d74.84357920000001!3d12.8705338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35b0035e6bba3%3A0xa0981ad80fbb2223!2sLumina%20Spaces!5e0!3m2!1sen!2sin!4v1785297120035!5m2!1sen!2sin",
  },
];

export function OfficeMaps() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-border pb-2">
        {OFFICES.map((office, idx) => (
          <button
            key={office.name}
            onClick={() => setActiveIdx(idx)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeIdx === idx
                ? "bg-[#111111] text-white"
                : "bg-secondary/40 text-muted-foreground hover:bg-secondary"
            }`}
          >
            {office.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <p className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <MapPin className="h-4.5 w-4.5 shrink-0 text-accent mt-0.5" />
          <span>{OFFICES[activeIdx].address}</span>
        </p>

        <div className="overflow-hidden rounded-xl border border-border bg-muted aspect-[16/10] w-full">
          <iframe
            src={OFFICES[activeIdx].embedUrl}
            title={OFFICES[activeIdx].name}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}

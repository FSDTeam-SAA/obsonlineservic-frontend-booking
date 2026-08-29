"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

// ==========================================
// 1. JSON DATA CONFIGURATION
// ==========================================
export const sanctuarySectionData = {
  subtitle: "WELCOME TO PARADISE",
  title: "A Sanctuary in the Heart of the Veluwe Forest",
  paragraphs: [
    "Veluwe Forest Retreat offers a perfect harmony of high-end architectural luxury and untouched natural beauty. Set inside Netherlands' most celebrated national park, our retreat is designed for those seeking peace, wellness, and refined comfort.",
    "Whether you want to wake up to the sound of whispering pines, indulge in a restorative spa session, or explore private pristine lake waters, every corner of our park is crafted to reconnect you with what matters.",
    "Discover the thrill of hiking through ancient forests, the tranquility of stargazing under clear night skies, or the joy of sharing stories around a crackling campfire—our park offers unforgettable moments for every adventurer.",
    "Imagine mornings filled with bird songs and afternoons spent kayaking on crystal-clear streams; our park is a sanctuary where every path leads to new discoveries and cherished memories.",
  ],
  badge: {
    tagline: "CERTIFIED ECO-PARK",
    title: "100% Sustainable Stay",
  },
  image:
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop",
};

interface ForestSanctuaryProps {
  data?: typeof sanctuarySectionData;
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function ForestSanctuarySection({
  data = sanctuarySectionData,
}: ForestSanctuaryProps) {
  return (
    <section className="w-full bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Image with Floating Eco Badge */}
          <div className="lg:col-span-6  relative w-full h-[380px] sm:h-[440px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={data.image}
              alt={data.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />

            {/* Floating Glassmorphism Eco-Park Badge */}
            <div className="absolute  bottom-5 left-5 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-3.5 shadow-lg border border-white/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F0F4FA] flex items-center justify-center text-[#3B3388] shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="text-left">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none mb-1">
                  {data.badge.tagline}
                </p>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-none">
                  {data.badge.title}
                </h4>
              </div>
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 ">
            {/* Subtitle Badge */}
            <span className="text-[11px] sm:text-xs font-bold text-[#3B3388] tracking-widest uppercase block">
              {data.subtitle}
            </span>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-slate-900 leading-tight tracking-tight">
              {data.title}
            </h2>

            {/* Descriptive Paragraphs */}
            <div className="space-y-3.5 pt-1 text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
              {data.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
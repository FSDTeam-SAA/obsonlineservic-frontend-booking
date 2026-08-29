"use client";

import Image from "next/image";
import { Star, MapPin, Home, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";

export const retreatHeroData = {
  rating: 4.9,
  reviewsCount: "1,284",
  title: "Veluwe Forest Retreat",
  location: "Skåne, Sweden",
  totalHomes: "42 Holiday Homes",
  startingPrice: "From €129 /night",
  primaryButtonText: "Book Your Stay",
  secondaryButtonText: "View Holiday Homes",
  backgroundImage:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop",
};

interface RetreatHeroBannerProps {
  data?: typeof retreatHeroData;
}

export default function RetreatHeroBanner({
  data = retreatHeroData,
}: RetreatHeroBannerProps) {
  return (
    <section className="relative w-full h-[480px] sm:h-[540px] md:h-[580px] flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <Image
        src={data.backgroundImage}
        alt={data.title}
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark Dimming Overlay with Bottom Mist / Fog Fade */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#EEF2F6] opacity-95 pointer-events-none" />

      {/* Hero Content Section */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center text-white flex flex-col items-center justify-center space-y-4">
        
        {/* Rating Row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/95">
            {data.rating} · ({data.reviewsCount})
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
          {data.title}
        </h1>

        {/* Sub-details (Location, Total Homes, Price) */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-100/90 font-medium pt-1">
          {/* Location */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-white/80" />
            <span>{data.location}</span>
          </div>

          {/* Homes Count */}
          <div className="flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-white/80" />
            <span>{data.totalHomes}</span>
          </div>

          {/* Starting Price */}
          <div className="flex items-center gap-1.5">
            <Euro className="w-3.5 h-3.5 text-white/80" />
            <span>{data.startingPrice}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          {/* Primary Action Button */}
          <Button className="bg-[#332A85] hover:bg-[#28216A] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 h-10 rounded-sm shadow-md transition-colors">
            {data.primaryButtonText}
          </Button>

          {/* Secondary Glassmorphism Button */}
          <Button
            variant="outline"
            className="bg-white/80 !rounded-sm hover:bg-white text-[#332A85] border-white/70 backdrop-blur-sm text-xs sm:text-sm font-semibold px-6 py-2.5 h-10 shadow-xs transition-colors"
          >
            {data.secondaryButtonText}
          </Button>
        </div>

      </div>
    </section>
  );
}

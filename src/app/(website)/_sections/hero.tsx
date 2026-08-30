"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, Home, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  title1: string;
  title2: string;
  img: string;
  description: string;
}

const quickDestinations = [
  { name: "Veluwe Forest", count: "12 Properties" },
  { name: "Austria Alps", count: "8 Villas" },
  { name: "Scandinavian Fjords", count: "15 Chalets" },
  { name: "Lake Geneva", count: "6 Lodges" },
];

export function Hero({ title1, title2, img, description }: HeroProps) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [category, setCategory] = useState("All Properties");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set("search", destination.trim());
    if (guests) params.set("guests", guests);
    if (category && category !== "All Properties" && category !== "All Types") params.set("category", category);
    
    router.push(`/search?${params.toString()}`);
  };

  const handleQuickSelect = (destName: string) => {
    setDestination(destName);
    const params = new URLSearchParams();
    params.set("search", destName);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section
      className="hero-motion relative isolate min-h-[640px] overflow-hidden bg-slate-900 sm:min-h-[680px]"
      aria-labelledby="hero-title"
    >
      <Image
        src={img || "/images/HomeHero.png"}
        alt="A secluded Scandinavian holiday cabin beside a forest lake"
        fill
        priority
        sizes="100vw"
        className="hero-motion__image object-cover object-center scale-105 filter brightness-95"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-slate-950/50" />
      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/30 to-transparent pointer-events-none" />

      <div className="relative mx-auto flex min-h-[640px] max-w-6xl flex-col items-center px-4 sm:px-6 pb-24 pt-20 text-center sm:min-h-[680px] sm:pt-24">
        {/* Title Block */}
        <div className="hero-motion__content text-white max-w-3xl space-y-3">
          <Badge variant="secondary" className="bg-white/15 text-white backdrop-blur-md border-white/20 px-3 py-1 text-[11px] gap-1.5 font-medium">
            <Sparkles className="size-3 text-amber-300" />
            <span>Exclusive Luxury Holiday Parks & Villas</span>
          </Badge>

          <h1
            id="hero-title"
            className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl drop-shadow-md text-white"
          >
            {title1}
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent">
              {title2}
            </span>
          </h1>

          <p className="mx-auto max-w-lg text-xs sm:text-sm leading-relaxed text-slate-200/90 font-normal">
            {description}
          </p>
        </div>

        {/* Liquid Glass Interactive Search Bar */}
        <div className="w-full max-w-5xl mt-8">
          <form
            onSubmit={handleSearch}
            className="hero-motion__search grid w-full gap-2 rounded-2xl bg-white/95 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl border border-white/80 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_120px]"
          >
            {/* Destination / Search Input */}
            <div className="relative flex min-h-12 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 text-left focus-within:bg-white focus-within:border-[#30277a] focus-within:ring-2 focus-within:ring-[#30277a]/15 transition-all">
              <MapPin className="size-4 shrink-0 text-[#30277a]" />
              <div className="min-w-0 flex-1">
                <label htmlFor="hero-dest-input" className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Where to?
                </label>
                <input
                  id="hero-dest-input"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Resort, City, Country..."
                  className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal bg-transparent outline-none truncate"
                />
              </div>
              {destination && (
                <button
                  type="button"
                  onClick={() => setDestination("")}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Check In */}
            <div className="flex min-h-12 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 text-left focus-within:bg-white focus-within:border-[#30277a] focus-within:ring-2 focus-within:ring-[#30277a]/15 transition-all">
              <Calendar className="size-4 shrink-0 text-slate-500" />
              <div className="min-w-0 flex-1">
                <label htmlFor="hero-checkin" className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Check In
                </label>
                <input
                  id="hero-checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-[11px] font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="flex min-h-12 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 text-left focus-within:bg-white focus-within:border-[#30277a] focus-within:ring-2 focus-within:ring-[#30277a]/15 transition-all">
              <Calendar className="size-4 shrink-0 text-slate-500" />
              <div className="min-w-0 flex-1">
                <label htmlFor="hero-checkout" className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Check Out
                </label>
                <input
                  id="hero-checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-[11px] font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Guests Select */}
            <div className="flex min-h-12 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 text-left focus-within:bg-white focus-within:border-[#30277a] focus-within:ring-2 focus-within:ring-[#30277a]/15 transition-all">
              <Users className="size-4 shrink-0 text-slate-500" />
              <div className="min-w-0 flex-1">
                <label htmlFor="hero-guests" className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Guests
                </label>
                <select
                  id="hero-guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                >
                  <option value="">Any Guests</option>
                  <option value="2">2+ Guests</option>
                  <option value="4">4+ Guests</option>
                  <option value="6">6+ Guests</option>
                  <option value="8">8+ Guests</option>
                </select>
              </div>
            </div>

            {/* Accommodation Type Select */}
            <div className="flex min-h-12 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 text-left focus-within:bg-white focus-within:border-[#30277a] focus-within:ring-2 focus-within:ring-[#30277a]/15 transition-all">
              <Home className="size-4 shrink-0 text-slate-500" />
              <div className="min-w-0 flex-1">
                <label htmlFor="hero-category" className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  Type
                </label>
                <select
                  id="hero-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                >
                  <option value="All Properties">All Types</option>
                  <option value="Lakefront">Lakefront</option>
                  <option value="Cabins & Lodges">Cabins & Lodges</option>
                  <option value="Wellness Villas">Wellness Villas</option>
                </select>
              </div>
            </div>

            {/* Shadcn Submit Button */}
            <Button
              type="submit"
              className="h-12 w-full bg-[#30277a] hover:bg-[#21195b] text-white text-xs font-bold rounded-xl shadow-md gap-1.5 transition-all active:scale-95"
            >
              <Search className="size-4" />
              <span>Search</span>
            </Button>
          </form>

          {/* Quick Destination Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/90">
            <span className="text-[11px] font-semibold text-white/80">Popular:</span>
            {quickDestinations.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => handleQuickSelect(dest.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 text-[11px] font-medium transition-all active:scale-95 cursor-pointer"
              >
                <span>{dest.name}</span>
                <span className="text-[9px] text-amber-200 font-semibold">({dest.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



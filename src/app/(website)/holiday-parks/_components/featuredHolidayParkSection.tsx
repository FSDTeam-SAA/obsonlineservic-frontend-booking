"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getHolidayParks } from "@/features/holiday-parks/api/holiday-parks.api";
import { HolidayPark } from "@/features/holiday-parks/types";
import { HolidayParkCardSkeleton } from "@/features/holiday-parks/components/HolidayParkSkeleton";

const filterCountries = [
  "All Countries",
  "Netherlands",
  "Germany",
  "Belgium",
  "Austria",
  "France",
  "Sweden",
  "United Kingdom",
];

export default function FeaturedHolidayParkSection() {
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [parks, setParks] = useState<HolidayPark[]>([]);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadParks() {
      try {
        setLoading(true);
        const countryParam =
          selectedCountry !== "All Countries" ? selectedCountry : undefined;
        const res = await getHolidayParks({ country: countryParam, limit: 12 });
        if (isMounted) {
          setParks(res.items || []);
          setTotalFound(res.meta?.totalItems || 0);
        }
      } catch (err) {
        console.error("Failed to load holiday parks list:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadParks();
    return () => {
      isMounted = false;
    };
  }, [selectedCountry]);

  return (
    <section className="w-full bg-[#EEF2F6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-7">
        {/* Top Header Row: Filter Pills (Left) & Result Count (Right) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Countries Filter */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 rounded-full px-3.5 py-1.5 pr-7 text-xs font-normal text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
              >
                {filterCountries.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right Text */}
          <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {totalFound} Holiday Parks Found
          </span>
        </div>

        {/* Carousel Container */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
        >
          {/* Second Row: Heading & Navigation Arrows */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Explore All Holiday Parks
            </h2>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-2">
              <CarouselPrevious className="static translate-y-0 h-8 w-8 rounded-full border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs" />
              <CarouselNext className="static translate-y-0 h-8 w-8 rounded-full border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs" />
            </div>
          </div>

          {/* Cards List / Slider View */}
          <CarouselContent className="-ml-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <HolidayParkCardSkeleton />
                </CarouselItem>
              ))
            ) : parks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 w-full">
                No holiday parks found matching the criteria.
              </div>
            ) : (
              parks.map((item) => {
                const parkId = item._id;
                const imageSrc =
                  item.coverImage ||
                  item.heroBanner ||
                  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600";
                const locationText =
                  [item.location?.city, item.location?.country]
                    .filter(Boolean)
                    .join(", ") || "Europe";

                return (
                  <CarouselItem
                    key={parkId}
                    className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link href={`/holiday-parks/${parkId}`}>
                      <div className="group relative h-[340px] w-full overflow-hidden rounded-sm bg-slate-200 shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md">
                        <Image
                          src={imageSrc}
                          alt={item.title || item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white pointer-events-none">
                          <span className="block text-[11px] font-normal text-slate-300 tracking-wide mb-0.5">
                            {item.availableProperties ?? 0} Properties
                          </span>
                          <h3 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-white line-clamp-1">
                            {item.title || item.name}
                          </h3>
                          <div className="flex items-center gap-1 text-slate-300 text-xs mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{locationText}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}


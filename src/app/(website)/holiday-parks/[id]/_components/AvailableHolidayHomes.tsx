"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Ban,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ==========================================
// 1. DATA TYPES & JSON DATA
// ==========================================
export interface HolidayHomeItem {
  id: string;
  badgeLocation: string;
  rating: string;
  image: string;
  title: string;
  location: string;
  guests: number;
  beds: number;
  baths: number;
  petsAllowed: boolean;
  price: string;
  priceSubtext: string;
}

export const holidayHomesData = {
  heading: "Available Holiday Homes",
  subheading:
    "Select from our award-winning sustainable cabins, each designed for high-end comfort.",
  homes: [
    {
      id: "1",
      badgeLocation: "VELUWE, NETHERLANDS",
      rating: "4.88",
      image:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop",
      title: "Veluwe Forest Resort",
      location: "Veluwe Forest Resort, NL",
      guests: 4,
      beds: 2,
      baths: 2,
      petsAllowed: false,
      price: "€129",
      priceSubtext: "Price for per nights · Up to 4 guests included",
    },
    {
      id: "2",
      badgeLocation: "VELUWE, NETHERLANDS",
      rating: "4.88",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop",
      title: "Veluwe Forest Resort",
      location: "Veluwe Forest Resort, NL",
      guests: 4,
      beds: 2,
      baths: 2,
      petsAllowed: false,
      price: "€129",
      priceSubtext: "Price for per nights · Up to 4 guests included",
    },
    {
      id: "3",
      badgeLocation: "VELUWE, NETHERLANDS",
      rating: "4.88",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
      title: "Veluwe Forest Resort",
      location: "Veluwe Forest Resort, NL",
      guests: 4,
      beds: 2,
      baths: 2,
      petsAllowed: false,
      price: "€129",
      priceSubtext: "Price for per nights · Up to 4 guests included",
    },
    {
      id: "4",
      badgeLocation: "VELUWE, NETHERLANDS",
      rating: "4.88",
      image:
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600&auto=format&fit=crop",
      title: "Veluwe Forest Resort",
      location: "Veluwe Forest Resort, NL",
      guests: 4,
      beds: 2,
      baths: 2,
      petsAllowed: false,
      price: "€129",
      priceSubtext: "Price for per nights · Up to 4 guests included",
    },
    {
      id: "5",
      badgeLocation: "VELUWE, NETHERLANDS",
      rating: "4.88",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
      title: "Veluwe Forest Resort",
      location: "Veluwe Forest Resort, NL",
      guests: 4,
      beds: 2,
      baths: 2,
      petsAllowed: false,
      price: "€129",
      priceSubtext: "Price for per nights · Up to 4 guests included",
    },
    {
      id: "6",
      badgeLocation: "VELUWE, NETHERLANDS",
      rating: "4.88",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop",
      title: "Veluwe Forest Resort",
      location: "Veluwe Forest Resort, NL",
      guests: 4,
      beds: 2,
      baths: 2,
      petsAllowed: false,
      price: "€129",
      priceSubtext: "Price for per nights · Up to 4 guests included",
    },
    {
      id: "7",
      badgeLocation: "VELUWE, NETHERLANDS",
      rating: "4.88",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
      title: "Veluwe Forest Resort",
      location: "Veluwe Forest Resort, NL",
      guests: 4,
      beds: 2,
      baths: 2,
      petsAllowed: false,
      price: "€129",
      priceSubtext: "Price for per nights · Up to 4 guests included",
    },
    {
      id: "8",
      badgeLocation: "VELUWE, NETHERLANDS",
      rating: "4.88",
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop",
      title: "Veluwe Forest Resort",
      location: "Veluwe Forest Resort, NL",
      guests: 4,
      beds: 2,
      baths: 2,
      petsAllowed: false,
      price: "€129",
      priceSubtext: "Price for per nights · Up to 4 guests included",
    },
  ],
};

interface AvailableHolidayHomesProps {
  data?: typeof holidayHomesData;
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function AvailableHolidayHomes({
  data = holidayHomesData,
}: AvailableHolidayHomesProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="w-full bg-[#EEF2F6] py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {data.heading}
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
            {data.subheading}
          </p>
        </div>

        {/* 4-Column Grid (2 Rows x 4 Columns = 8 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.homes.map((home) => {
            const isFav = !!favorites[home.id];

            return (
              <Card
                key={home.id}
                className="overflow-hidden rounded-sm border border-slate-200/70 bg-white pt-0 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between"
              >
                <div>
                  {/* Top Image Box */}
                  <div className="relative h-[200px] w-full bg-slate-100">
                    <Image
                      src={home.image}
                      alt={home.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Location Badge */}
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md text-white">
                      <span className="text-[9px] font-semibold tracking-wider uppercase">
                        {home.badgeLocation}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-white">
                      <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                      <span className="text-[11px] font-semibold">
                        {home.rating}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <CardContent className="p-5 pb-3 space-y-3">
                    {/* Title & Favorite */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">
                        {home.title}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(home.id)}
                        className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center transition-colors"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFav
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-slate-400 -mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs text-slate-500 font-normal">
                        {home.location}
                      </span>
                    </div>

                    {/* Amenities Specs */}
                    <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-1 pb-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{home.guests} Guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5" />
                        <span>{home.beds} Bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5" />
                        <span>{home.baths} Bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Ban className="w-3.5 h-3.5" />
                        <span>No Animals</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-lg font-bold text-[#3B3388]">
                          {home.price}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">
                          /night
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {home.priceSubtext}
                      </p>
                    </div>
                  </CardContent>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-1 grid grid-cols-2 gap-2.5">
                  <Link href={"/property/1"}>
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold text-[#3B3388] border-slate-200 hover:bg-slate-50 rounded-lg h-9"
                  >
                    View Details
                  </Button>
                  </Link>
                  <Button className="w-full text-xs font-semibold bg-[#3B3388] hover:bg-[#2F296D] text-white rounded-lg h-9 transition-colors shadow-none">
                    Book Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}

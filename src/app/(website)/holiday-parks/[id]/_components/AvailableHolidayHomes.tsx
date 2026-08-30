import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Ban,
  Heart,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getValidImageUrl } from "@/lib/utils";
import { getHolidayParkProperties } from "@/features/holiday-parks/api/holiday-parks.api";

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
  ],
};

interface AvailableHolidayHomesProps {
  parkId?: string;
  data?: typeof holidayHomesData;
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function AvailableHolidayHomes({
  parkId,
  data = holidayHomesData,
}: AvailableHolidayHomesProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [homes, setHomes] = useState<HolidayHomeItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!parkId) {
      setHomes(data.homes);
      return;
    }

    async function loadParkHomes() {
      try {
        setLoading(true);
        const res = await getHolidayParkProperties(parkId!);
        const items = res?.items || (res as any)?.data?.items || res || [];
        
        if (Array.isArray(items) && items.length > 0) {
          const mapped: HolidayHomeItem[] = items.map((p: any) => ({
            id: p._id || p.id,
            badgeLocation: p.badge || p.holidayPark?.badgeLocation || "HOLIDAY HOME",
            rating: p.rating ? String(p.rating) : "4.9",
            image: p.gallery?.main || p.coverImage || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
            title: p.title || "Luxury Lodge",
            location: p.holidayPark?.title || p.holidayPark?.badgeLocation || "Holiday Park",
            guests: p.guests || 4,
            beds: p.beds || 2,
            baths: p.baths || 2,
            petsAllowed: p.petsAllowed ?? false,
            price: `€${p.pricePerNight || 129}`,
            priceSubtext: `Price per night · Up to ${p.guests || 4} guests included`,
          }));
          setHomes(mapped);
        } else {
          setHomes(data.homes);
        }
      } catch (err) {
        console.error("Failed to load park properties:", err);
        setHomes(data.homes);
      } finally {
        setLoading(false);
      }
    }

    void loadParkHomes();
  }, [parkId, data.homes]);

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

        {/* Loading Spinner / Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#3B3388]" />
            <span>Fetching available holiday homes for this park...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {homes.map((home) => {
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
                        src={getValidImageUrl(home.image)}
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
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {home.title}
                        </h3>
                        <button
                          onClick={() => toggleFavorite(home.id)}
                          className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
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
                        <span className="text-xs text-slate-500 font-normal truncate">
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
                    <Link href={`/property/${home.id}`}>
                      <Button
                        variant="outline"
                        className="w-full text-xs font-semibold text-[#3B3388] border-slate-200 hover:bg-slate-50 rounded-lg h-9 cursor-pointer"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/property/${home.id}`}>
                      <Button className="w-full text-xs font-semibold bg-[#3B3388] hover:bg-[#2F296D] text-white rounded-lg h-9 transition-colors shadow-none cursor-pointer">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

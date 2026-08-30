"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { getHolidayParks } from "@/features/holiday-parks/api/holiday-parks.api";
import { DestinationItem } from "@/features/holiday-parks/types";
import { FeaturedDestinationsGridSkeleton } from "@/features/holiday-parks/components/HolidayParkSkeleton";
import { getValidImageUrl } from "@/lib/utils";

export const destinationsData: DestinationItem[] = [
  {
    id: "1",
    name: "Netherlands",
    badgeLocation: "VELUWE, NETHERLANDS",
    subLocation: "Veluwe",
    parksCount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Germany",
    badgeLocation: "BAVARIA, GERMANY",
    subLocation: "Bavaria",
    parksCount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Belgium",
    badgeLocation: "ARDENNES, BELGIUM",
    subLocation: "Ardennes",
    parksCount: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Austria",
    badgeLocation: "SALZKAMMERGUT, AUSTRIA",
    subLocation: "Salzkammergut",
    parksCount: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "France",
    badgeLocation: "PROVENCE, FRANCE",
    subLocation: "Provence",
    parksCount: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
  },
];

const fallbackImagesByCountry: Record<string, string> = {
  Netherlands:
    "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=600&auto=format&fit=crop",
  Germany:
    "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=600&auto=format&fit=crop",
  Belgium:
    "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=600&auto=format&fit=crop",
  Austria:
    "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=600&auto=format&fit=crop",
  France:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
  Denmark:
    "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=600&auto=format&fit=crop",
  Norway:
    "https://images.unsplash.com/photo-1506701159344-12d8a571a067?q=80&w=600&auto=format&fit=crop",
  Italy:
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600&auto=format&fit=crop",
  "South Africa":
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=600&auto=format&fit=crop",
  Colorado:
    "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?q=80&w=600&auto=format&fit=crop",
};

const defaultFallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop";

function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseBadgeLocation(
  badgeLocation?: string,
  locationCountry?: string,
  locationCity?: string
): { name: string; badgeLocation: string; subLocation?: string } {
  let rawBadge = badgeLocation?.trim();

  if (!rawBadge) {
    if (locationCity && locationCountry) {
      rawBadge = `${locationCity.toUpperCase()}, ${locationCountry.toUpperCase()}`;
    } else if (locationCountry) {
      rawBadge = locationCountry.toUpperCase();
    } else {
      rawBadge = "EUROPE";
    }
  }

  const parts = rawBadge.split(",").map((p) => p.trim()).filter(Boolean);

  if (parts.length > 1) {
    const mainCountryStr = parts[parts.length - 1];
    const subLocStr = parts[0];
    return {
      name: toTitleCase(mainCountryStr),
      badgeLocation: rawBadge.toUpperCase(),
      subLocation: toTitleCase(subLocStr),
    };
  } else {
    const nameStr = parts[0] || "Europe";
    return {
      name: toTitleCase(nameStr),
      badgeLocation: rawBadge.toUpperCase(),
      subLocation: undefined,
    };
  }
}

interface FeaturedDestinationsProps {
  destinations?: DestinationItem[];
  title?: string;
}

export default function FeaturedDestinations({
  destinations = destinationsData,
  title = "Featured Destinations",
}: FeaturedDestinationsProps) {
  const [itemsList, setItemsList] = useState<DestinationItem[]>(destinations);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicDestinations() {
      try {
        setLoading(true);
        const res = await getHolidayParks({ limit: 100 });
        const parks = res?.items || [];
        if (parks.length > 0) {
          const grouped: Record<
            string,
            {
              name: string;
              badgeLocation: string;
              subLocation?: string;
              count: number;
              image?: string;
            }
          > = {};

          parks.forEach((park) => {
            const parsed = parseBadgeLocation(
              park.badgeLocation,
              park.location?.country,
              park.location?.city
            );

            if (!grouped[parsed.name]) {
              const rawImage = park.coverImage || park.heroBanner;
              const validImg = getValidImageUrl(rawImage);
              grouped[parsed.name] = {
                name: parsed.name,
                badgeLocation: parsed.badgeLocation,
                subLocation: parsed.subLocation,
                count: 0,
                image: validImg,
              };
            }

            grouped[parsed.name].count += 1;

            if (!grouped[parsed.name].image) {
              const rawImage = park.coverImage || park.heroBanner;
              if (rawImage) {
                grouped[parsed.name].image = getValidImageUrl(rawImage);
              }
            }
          });

          const dynamicItems: DestinationItem[] = Object.entries(grouped)
            .map(([destName, info], idx) => {
              const finalImage =
                info.image ||
                fallbackImagesByCountry[destName] ||
                defaultFallbackImage;

              return {
                id: String(idx + 1),
                name: info.name,
                badgeLocation: info.badgeLocation,
                subLocation: info.subLocation,
                parksCount: info.count,
                imageUrl: finalImage,
              };
            })
            .sort((a, b) => b.parksCount - a.parksCount);

          if (dynamicItems.length > 0 && isMounted) {
            setItemsList(dynamicItems);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic destinations from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDynamicDestinations();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore top-rated holiday park locations across Europe
            </p>
          </div>
        </div>

        {/* Dynamic Destination Cards Grid / Skeleton */}
        {loading ? (
          <FeaturedDestinationsGridSkeleton count={5} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {itemsList.map((item) => (
              <Link
                key={item.id}
                href={`/search?country=${encodeURIComponent(item.name)}`}
                className="group relative h-[360px] w-full overflow-hidden rounded-sm bg-slate-900 shadow-xs cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
              >
                {/* Destination Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Location Badge (Top-Left) */}
                <div className="absolute top-3.5 left-3.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1.5 text-white border border-white/10 shadow-xs">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-[9.5px] font-semibold tracking-wider uppercase truncate max-w-[130px]">
                    {item.badgeLocation}
                  </span>
                </div>

                {/* Parks Count Pill (Top-Right) */}
                <div className="absolute top-3.5 right-3.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-white border border-white/10 text-[10px] font-semibold tracking-wide">
                  {item.parksCount} {item.parksCount === 1 ? "Park" : "Parks"}
                </div>

                {/* Card Content Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex flex-col justify-end">
                  {item.subLocation && (
                    <span className="text-[10px] font-semibold text-amber-300 tracking-wider uppercase mb-0.5">
                      {item.subLocation}
                    </span>
                  )}
                  <h3 className="text-xl font-bold leading-snug tracking-tight text-white group-hover:text-amber-200 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-1 font-medium">
                    <span>Explore Parks</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


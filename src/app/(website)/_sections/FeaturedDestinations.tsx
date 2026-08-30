"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHolidayParks } from "@/features/holiday-parks/api/holiday-parks.api";
import { getValidImageUrl } from "@/lib/utils";

export interface DestinationItem {
  id: string;
  name: string;
  parksCount: number;
  imageUrl: string;
}

export const destinationsData: DestinationItem[] = [
  {
    id: "1",
    name: "Netherlands",
    parksCount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Germany",
    parksCount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Belgium",
    parksCount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Austria",
    parksCount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "France",
    parksCount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
  },
];

interface FeaturedDestinationsProps {
  destinations?: DestinationItem[];
  title?: string;
}

export default function FeaturedDestinations({
  destinations = destinationsData,
  title = "Featured Destinations",
}: FeaturedDestinationsProps) {
  const [itemsList, setItemsList] = useState<DestinationItem[]>(destinations);

  useEffect(() => {
    async function loadDynamicDestinations() {
      try {
        const res = await getHolidayParks({ limit: 100 });
        const parks = res?.items || [];
        if (parks.length > 0) {
          const grouped: Record<string, { count: number; image?: string }> = {};
          parks.forEach((park) => {
            const country = park.location?.country || "Europe";
            if (!grouped[country]) {
              grouped[country] = { count: 0, image: park.coverImage || park.heroBanner };
            }
            grouped[country].count += 1;
          });

          const dynamicItems: DestinationItem[] = Object.entries(grouped).map(
            ([countryName, info], idx) => ({
              id: String(idx + 1),
              name: countryName,
              parksCount: info.count,
              imageUrl: getValidImageUrl(info.image),
            })
          );

          if (dynamicItems.length > 0) {
            setItemsList(dynamicItems);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic destinations from API:", err);
      }
    }
    loadDynamicDestinations();
  }, []);

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-6">
        {/* Section Heading */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
          {title}
        </h2>

        {/* Dynamic Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {itemsList.map((item) => (
            <Link
              key={item.id}
              href={`/search?country=${encodeURIComponent(item.name)}`}
              className="group relative h-[360px] w-full overflow-hidden rounded-sm bg-slate-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md block"
            >
              {/* Destination Image */}
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Card Content Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="block text-[11px] font-normal text-slate-300 tracking-wide mb-1">
                  {item.parksCount} {item.parksCount === 1 ? "Park" : "Parks"}
                </span>
                <h3 className="text-lg font-bold leading-snug tracking-tight text-white">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Dog,
  Ban,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchPopularProperties, fetchProperties } from "@/features/properties/api/properties.api";
import { Property, PropertyCategory } from "@/features/properties/types/properties.types";
import { PropertiesGridSkeleton } from "@/features/properties/components/PropertySkeleton";
import { getValidImageUrl } from "@/lib/utils";

const categoryTabs: PropertyCategory[] = [
  "All Properties",
  "Lakefront",
  "Cabins & Lodges",
  "Wellness Villas",
];

export default function PopularHolidayProperties() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>("All Properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        if (selectedCategory === "All Properties") {
          const popular = await fetchPopularProperties();
          if (isMounted) {
            if (popular && popular.length > 0) {
              setProperties(popular);
            } else {
              // Fallback to fetch first 4 properties
              const res = await fetchProperties({ limit: 4 });
              setProperties(res.items || []);
            }
          }
        } else {
          const res = await fetchProperties({ category: selectedCategory, limit: 4 });
          if (isMounted) {
            setProperties(res.items || []);
          }
        }
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="properties" className="w-full py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-8">
        {/* Header: Title & Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Popular Holiday Properties
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedCategory(tab)}
                  className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
                    isActive
                      ? "bg-[#3B3388] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Properties Grid or Skeleton */}
        {loading ? (
          <PropertiesGridSkeleton count={4} />
        ) : properties.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-sm border border-slate-200">
            No properties found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {properties.map((property) => {
              const isFav = !!favorites[property._id];
              const mainImg = getValidImageUrl(property.gallery?.main);

              return (
                <Card
                  key={property._id}
                  className="overflow-hidden rounded-sm border border-slate-200/70 bg-white pt-0 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                >
                  <div>
                    {/* Top Image & Badges */}
                    <div className="relative h-[200px] w-full bg-slate-100">
                      <Image
                        src={mainImg}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Tag Badge */}
                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md text-white">
                        <span className="text-[9px] font-semibold tracking-wider uppercase">
                          {property.badge || "PREMIUM VILLA"}
                        </span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-white">
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="text-[11px] font-semibold">
                          {property.rating || 4.88}
                        </span>
                      </div>
                    </div>

                    {/* Card Body Content */}
                    <CardContent className="p-5 pb-3 space-y-3">
                      {/* Title & Favorite Icon */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 truncate pr-2">
                          {property.title}
                        </h3>
                        <button
                          onClick={() => toggleFavorite(property._id)}
                          className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center transition-colors shrink-0"
                          aria-label="Toggle favorite"
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
                      <div className="flex items-center gap-1.5 text-slate-400 -mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs text-slate-500 font-normal truncate">
                          {property.location}
                        </span>
                      </div>

                      {/* Specs / Amenities Row */}
                      <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-1 pb-1">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{property.guests} Guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          <span>{property.beds} Bed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" />
                          <span>{property.baths} Bath</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {property.petsAllowed ? (
                            <>
                              <Dog className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">Pets</span>
                            </>
                          ) : (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>No Pets</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-lg font-bold text-[#3B3388]">
                            {property.currency || "€"}{property.pricePerNight}
                          </span>
                          <span className="text-xs text-slate-400 font-normal">
                            /night
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                          {property.priceSubtext || "Price per night · Up to 4 guests"}
                        </p>
                      </div>
                    </CardContent>
                  </div>

                  {/* Bottom 2 Action Buttons */}
                  <div className="p-5 pt-1 grid grid-cols-2 gap-2.5">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/property/${property._id}`)}
                      className="w-full text-xs font-semibold text-[#3B3388] border-slate-200 hover:bg-slate-50 rounded-sm h-9"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => router.push(`/property/${property._id}`)}
                      className="w-full text-xs font-semibold bg-[#3B3388] hover:bg-[#2F296D] text-white rounded-sm h-9 transition-colors shadow-none"
                    >
                      Book Now
                    </Button>
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

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Dog,
  Ban,
  Heart,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchProperties } from "../api/properties.api";
import { Property, PropertyCategory } from "../types/properties.types";
import { PropertiesGridSkeleton } from "./PropertySkeleton";

const categoryTabs: PropertyCategory[] = [
  "All Properties",
  "Lakefront",
  "Cabins & Lodges",
  "Wellness Villas",
];

export function PropertyCatalogue() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams?.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams?.get("category") || "All Properties"
  );
  const [guests, setGuests] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [properties, setProperties] = useState<Property[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      try {
        setLoading(true);
        const res = await fetchProperties({
          search: search || undefined,
          category: selectedCategory !== "All Properties" ? selectedCategory : undefined,
          guests: guests || undefined,
          page,
          limit,
        });

        if (isMounted) {
          setProperties(res.items || []);
          setTotalPages(res.meta?.totalPages || 1);
          setTotalItems(res.meta?.total || 0);
        }
      } catch (err) {
        console.error("Failed to load properties catalogue:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(loadProperties, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [search, selectedCategory, guests, page, limit]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All Properties");
    setGuests(undefined);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="container mx-auto space-y-8">
        {/* Banner Title */}
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Luxury Holiday Homes & Villas
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Find the perfect getaway destination, from peaceful lakefront chalets to luxury forest lodges.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, location or keywords..."
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B3388] transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedCategory(tab);
                    setPage(1);
                  }}
                  className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-[#3B3388] text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Guests Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={guests || ""}
              onChange={(e) => {
                setGuests(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              className="h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 outline-none focus:border-[#3B3388]"
            >
              <option value="">Any Guests</option>
              <option value="2">2+ Guests</option>
              <option value="4">4+ Guests</option>
              <option value="6">6+ Guests</option>
              <option value="8">8+ Guests</option>
            </select>

            {(search || selectedCategory !== "All Properties" || guests) && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="h-11 text-xs text-slate-500 hover:text-slate-900"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{properties.length}</strong> of{" "}
            <strong className="text-slate-800">{totalItems}</strong> properties
          </span>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <PropertiesGridSkeleton count={8} />
        ) : properties.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-xl border border-slate-200">
            <Filter className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No properties found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn’t find any properties matching your current search or filter criteria.
            </p>
            <Button
              onClick={handleResetFilters}
              className="bg-[#3B3388] text-white text-xs font-semibold px-5 h-9 rounded-lg"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {properties.map((property) => {
              const isFav = !!favorites[property._id];
              const mainImg =
                property.gallery?.main ||
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop";

              return (
                <Card
                  key={property._id}
                  className="overflow-hidden rounded-sm border border-slate-200/70 bg-white pt-0 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-[200px] w-full bg-slate-100">
                      <Image
                        src={mainImg}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md text-white">
                        <span className="text-[9px] font-semibold tracking-wider uppercase">
                          {property.badge || "PREMIUM VILLA"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-white">
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="text-[11px] font-semibold">
                          {property.rating || 4.88}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <CardContent className="p-5 pb-3 space-y-3">
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

                      <div className="flex items-center gap-1.5 text-slate-400 -mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs text-slate-500 font-normal truncate">
                          {property.location}
                        </span>
                      </div>

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

                  {/* Actions */}
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-6">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs font-medium border-slate-200 text-slate-600 gap-1.5 h-9"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <span className="text-xs text-slate-600 font-semibold">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs font-medium border-slate-200 text-slate-600 gap-1.5 h-9"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

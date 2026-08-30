"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Dog,
  Ban,
  Heart,
  SlidersHorizontal,
  X,
  Trees,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fetchProperties } from "@/features/properties/api/properties.api";
import { getHolidayParks } from "@/features/holiday-parks/api/holiday-parks.api";
import { Property } from "@/features/properties/types/properties.types";
import { HolidayPark } from "@/features/holiday-parks/types";
import { PropertiesGridSkeleton } from "@/features/properties/components/PropertySkeleton";
import { getValidImageUrl } from "@/lib/utils";

export default function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("search") || searchParams?.get("q") || "");
  const [category, setCategory] = useState(searchParams?.get("category") || "All");
  const [guests, setGuests] = useState<number | undefined>(
    searchParams?.get("guests") ? Number(searchParams.get("guests")) : undefined
  );
  const [country, setCountry] = useState(searchParams?.get("country") || "All");
  const [activeTab, setActiveTab] = useState<"properties" | "parks">("properties");
  const [page, setPage] = useState(1);

  // Data State
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [holidayParks, setHolidayParks] = useState<HolidayPark[]>([]);
  const [totalParks, setTotalParks] = useState(0);

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Sync state when URL params change
  useEffect(() => {
    const qSearch = searchParams?.get("search") || searchParams?.get("q") || "";
    const qCategory = searchParams?.get("category") || "All";
    const qGuests = searchParams?.get("guests") ? Number(searchParams.get("guests")) : undefined;
    const qCountry = searchParams?.get("country") || "All";

    setSearchTerm(qSearch);
    setCategory(qCategory);
    setGuests(qGuests);
    setCountry(qCountry);
  }, [searchParams]);

  // Parallel Fetch Data
  useEffect(() => {
    let isMounted = true;

    async function loadSearchResults() {
      try {
        setLoading(true);
        const [propRes, parkRes] = await Promise.all([
          fetchProperties({
            search: searchTerm || undefined,
            category: category !== "All" && category !== "All Properties" ? category : undefined,
            guests: guests || undefined,
            country: country !== "All" ? country : undefined,
            page,
            limit: 8,
          }).catch((err) => {
            console.error("Failed to fetch properties search:", err);
            return { items: [], meta: { total: 0, totalPages: 1 } };
          }),
          getHolidayParks({
            search: searchTerm || undefined,
            country: country !== "All" ? country : undefined,
            limit: 8,
          }).catch((err) => {
            console.error("Failed to fetch holiday parks search:", err);
            return { items: [], meta: { totalItems: 0 } };
          }),
        ]);

        if (isMounted) {
          setProperties(propRes.items || []);
          setTotalProperties(propRes.meta?.total || 0);
          setTotalPages(propRes.meta?.totalPages || 1);

          setHolidayParks(parkRes.items || []);
          setTotalParks((parkRes as any).meta?.totalItems ?? (parkRes as any).meta?.total ?? 0);
        }
      } catch (err) {
        console.error("Failed search query execution:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(loadSearchResults, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, category, guests, country, page]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setGuests(undefined);
    setCountry("All");
    setPage(1);
    router.replace("/search");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="container mx-auto space-y-8 max-w-7xl">
        {/* Header Section */}
        <div className="space-y-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#30277a] mb-1">
                <Search className="size-4" />
                <span>Global Destination Search</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {searchTerm ? (
                  <>
                    Search Results for <span className="text-[#30277a]">"{searchTerm}"</span>
                  </>
                ) : (
                  "Explore All Destinations & Holiday Homes"
                )}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-3 py-1 bg-slate-50 border-slate-200">
                {totalProperties} Properties Found
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1 bg-slate-50 border-slate-200">
                {totalParks} Holiday Parks
              </Badge>
            </div>
          </div>

          {/* Filter Controls Row */}
          <div className="pt-4 border-t border-slate-150 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Keyword */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search resort, title, city..."
                className="pl-9 pr-8 h-10 text-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 outline-none focus:border-[#30277a]"
            >
              <option value="All">All Categories</option>
              <option value="Lakefront">Lakefront</option>
              <option value="Cabins & Lodges">Cabins & Lodges</option>
              <option value="Wellness Villas">Wellness Villas</option>
            </select>

            {/* Guests Select */}
            <select
              value={guests || ""}
              onChange={(e) => {
                setGuests(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 outline-none focus:border-[#30277a]"
            >
              <option value="">Any Capacity</option>
              <option value="2">2+ Guests</option>
              <option value="4">4+ Guests</option>
              <option value="6">6+ Guests</option>
              <option value="8">8+ Guests</option>
            </select>

            {/* Country Select */}
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 outline-none focus:border-[#30277a]"
            >
              <option value="All">All Countries</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Germany">Germany</option>
              <option value="Austria">Austria</option>
              <option value="Belgium">Belgium</option>
              <option value="Sweden">Sweden</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || category !== "All" || guests || country !== "All") && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="h-10 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
              >
                Reset All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === "properties"
                  ? "bg-[#30277a] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Home className="size-3.5" />
              <span>Properties ({totalProperties})</span>
            </button>

            <button
              onClick={() => setActiveTab("parks")}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === "parks"
                  ? "bg-[#30277a] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Trees className="size-3.5" />
              <span>Holiday Parks ({totalParks})</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing results for {activeTab === "properties" ? "Holiday Properties" : "Holiday Parks"}
          </span>
        </div>

        {/* Properties Grid */}
        {activeTab === "properties" && (
          <>
            {loading ? (
              <PropertiesGridSkeleton count={8} />
            ) : properties.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
                <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No properties matched your query</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your filter parameters or search with broader keywords.
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-[#30277a] text-white text-xs font-semibold px-5 h-9 rounded-xl"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {properties.map((property) => {
                  const isFav = !!favorites[property._id];
                  const mainImg = getValidImageUrl(property.gallery?.main);

                  return (
                    <Card
                      key={property._id}
                      className="overflow-hidden rounded-xl border border-slate-200/70 bg-white pt-0 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between"
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

                        {/* Content */}
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
                                  isFav ? "fill-red-500 text-red-500" : "text-slate-400"
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
                              <span className="text-lg font-bold text-[#30277a]">
                                {property.currency || "€"}{property.pricePerNight}
                              </span>
                              <span className="text-xs text-slate-400 font-normal">
                                /night
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </div>

                      {/* Actions */}
                      <div className="p-5 pt-1 grid grid-cols-2 gap-2.5">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/property/${property._id}`)}
                          className="w-full text-xs font-semibold text-[#30277a] border-slate-200 hover:bg-slate-50 rounded-lg h-9"
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => router.push(`/property/${property._id}`)}
                          className="w-full text-xs font-semibold bg-[#30277a] hover:bg-[#21195b] text-white rounded-lg h-9 shadow-none"
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
          </>
        )}

        {/* Holiday Parks Grid */}
        {activeTab === "parks" && (
          <>
            {loading ? (
              <PropertiesGridSkeleton count={4} />
            ) : holidayParks.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
                <Trees className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No holiday parks found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching with standard country names or clear filters.
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-[#30277a] text-white text-xs font-semibold px-5 h-9 rounded-xl"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {holidayParks.map((park) => {
                  const imageSrc = getValidImageUrl(park.coverImage || park.heroBanner);
                  const locationText =
                    [park.location?.city, park.location?.country].filter(Boolean).join(", ") ||
                    "Europe";

                  return (
                    <Link key={park._id} href={`/holiday-parks/${park._id}`}>
                      <div className="group relative h-[320px] w-full overflow-hidden rounded-2xl bg-slate-200 shadow-xs cursor-pointer transition-all duration-300 hover:shadow-lg border border-slate-200">
                        <Image
                          src={imageSrc}
                          alt={park.title || park.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white pointer-events-none">
                          <span className="block text-[11px] font-semibold text-amber-300 tracking-wide mb-1">
                            {park.availableProperties ?? 0} Available Accommodations
                          </span>
                          <h3 className="text-lg font-bold leading-tight tracking-tight text-white line-clamp-1">
                            {park.title || park.name}
                          </h3>
                          <div className="flex items-center gap-1 text-slate-300 text-xs mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{locationText}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

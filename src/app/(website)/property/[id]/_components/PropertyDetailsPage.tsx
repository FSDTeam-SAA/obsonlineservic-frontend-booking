"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Maximize,
  Car,
  Wifi,
  Calendar,
  ChevronDown,
  Flame,
  Waves,
  Utensils,
  Coffee,
  Tv,
  Wind,
  ShieldCheck,
  Zap,
  Lock,
  Grid,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchPropertyById } from "@/features/properties/api/properties.api";
import { Property } from "@/features/properties/types/properties.types";
import { PropertyDetailsSkeleton } from "@/features/properties/components/PropertyDetailsSkeleton";
import { validateOfferCode } from "@/features/offers/api/offers.api";
import { ValidateOfferResponse } from "@/features/offers/types/offers.types";
import { api } from "@/lib/api";
import { Tag, Loader2, CheckCircle2 } from "lucide-react";
import { getValidImageUrl } from "@/lib/utils";
import { BookingModal } from "@/features/bookings/components/BookingModal";
import { BookingConfirmationModal } from "@/features/bookings/components/BookingConfirmationModal";
import { Booking } from "@/features/bookings/types/bookings.types";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = (params?.id as string) || "";

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [guestsCount, setGuestsCount] = useState<number>(4);
  const [isSaved, setIsSaved] = useState(false);

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Promo / Offer Code state
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<ValidateOfferResponse | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPropertyById(propertyId);
        if (isMounted) {
          setProperty(data);
        }

        // Fetch guest reviews for property if available
        try {
          const revRes = await api.get(`/reviews?property=${propertyId}`);
          if (isMounted && revRes.data) {
            const list = Array.isArray(revRes.data)
              ? revRes.data
              : revRes.data.items || [];
            setReviews(list);
          }
        } catch (e) {
          // fallback gracefully
        }
      } catch (err: any) {
        console.error("Failed to load property details:", err);
        if (isMounted) {
          setError(err?.response?.data?.message || "Property not found.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-bold text-slate-800">Property Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md">
          {error || "The property you are looking for does not exist or has been removed."}
        </p>
        <Button
          onClick={() => router.push("/property")}
          className="bg-[#3B3388] text-white text-xs font-semibold px-6 h-10 rounded-lg"
        >
          Back to All Properties
        </Button>
      </div>
    );
  }

  // Calculate pricing breakdown
  const pricePerNight = property.pricePerNight || 129;
  const nights = 5; // Default display nights
  const cleaningFee = property.cleaningFee ?? 80;
  const taxes = property.taxes ?? 45;
  const basePriceTotal = pricePerNight * nights;
  const grossTotal = basePriceTotal + cleaningFee + taxes;
  const discountAmount = appliedOffer ? appliedOffer.calculatedDiscount : 0;
  const grandTotal = Math.max(0, grossTotal - discountAmount);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    try {
      setValidatingPromo(true);
      setPromoError(null);
      const res = await validateOfferCode({
        code: promoCodeInput.trim(),
        bookingAmount: grossTotal,
        propertyId: property?._id,
      });
      setAppliedOffer(res);
    } catch (err: any) {
      setAppliedOffer(null);
      setPromoError(err?.response?.data?.message || "Invalid or expired promo code.");
    } finally {
      setValidatingPromo(false);
    }
  };

  const galleryMain = getValidImageUrl(
    property.gallery?.main,
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
  );
  const gallerySide1 = getValidImageUrl(
    property.gallery?.side1,
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop"
  );
  const gallerySide2 = getValidImageUrl(
    property.gallery?.side2,
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop"
  );
  const gallerySide3 = getValidImageUrl(
    property.gallery?.side3,
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"
  );

  const specsList = property.specs?.length
    ? property.specs
    : [
        { label: "GUESTS", value: `Up to ${property.guests || 4}` },
        { label: "BEDROOM", value: `${property.beds || 2} Rooms` },
        { label: "BATHROOMS", value: `${property.baths || 2} Baths` },
        { label: "SIZE", value: property.size || "240 m²" },
        { label: "PARKING", value: property.parking || "Free Private" },
        { label: "WIFI", value: property.wifi || "Free 24h" },
      ];

  const amenitiesList = property.amenities?.length
    ? property.amenities
    : [
        { name: "Private Sauna" },
        { name: "Lake View" },
        { name: "Kitchen" },
        { name: "Coffee Machine" },
        { name: "Smart TV" },
        { name: "Air Conditioning" },
        { name: "Heating" },
        { name: "Free Parking" },
      ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="container mx-auto space-y-12">
        {/* Top Grid: Gallery & Main Details + Booking Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CONTENT COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-auto md:h-[460px] rounded-sm overflow-hidden shadow-xs">
              {/* Main Featured Image */}
              <div className="md:col-span-8 relative h-[300px] md:h-full overflow-hidden bg-slate-200">
                <Image
                  src={galleryMain}
                  alt={property.title}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-md text-white">
                  <span className="text-[10px] font-semibold tracking-wider uppercase">
                    {property.badge || "FEATURED LODGE"}
                  </span>
                </div>
              </div>

              {/* 3 Right Stacked Images */}
              <div className="md:col-span-4 grid grid-cols-3 md:grid-cols-1 gap-3 h-full">
                <div className="relative h-[110px] md:h-full overflow-hidden bg-slate-200">
                  <Image
                    src={gallerySide1}
                    alt="Property detail"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-[110px] md:h-full overflow-hidden bg-slate-200">
                  <Image
                    src={gallerySide2}
                    alt="Property detail"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-[110px] md:h-full overflow-hidden bg-slate-200 group">
                  <Image
                    src={gallerySide3}
                    alt="Property detail"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-xs flex items-center gap-1.5 transition-all">
                    <Grid className="w-3.5 h-3.5" />
                    <span>Photos ({property.gallery?.totalPhotos || 4})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Title & Metadata Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {property.title}
                </h1>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                  <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{property.rating || 4.9}</span>
                  <span className="text-slate-400 font-normal">
                    [{property.reviewsCount || 1248} reviews]
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{property.location}</span>
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed pt-1">
                {property.description ||
                  "An architectural masterpiece perched in pristine surroundings, offering private wellness, floor-to-ceiling vistas, and bespoke luxury."}
              </p>
            </div>

            {/* Specifications Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {specsList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-sm p-3 text-center flex flex-col items-center justify-center min-h-[95px] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                >
                  <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mb-1">
                    {item.label}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Amenities Section */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-bold text-slate-900">
                Premium Amenities Included
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
                {amenitiesList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-slate-600 font-medium"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Flame className="w-3.5 h-3.5 stroke-[1.75]" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: BOOKING WIDGET */}
          <div className="lg:col-span-4 sticky top-6">
            <Card className="rounded-sm border border-slate-200/80 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-6">
              {/* Header Price */}
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-slate-400 font-normal">From</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {property.currency || "€"}
                    {pricePerNight}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">/ Night</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 italic">
                  {property.guaranteeText || "Best Price Guarantee"}
                </span>
              </div>

              {/* Date & Guest Inputs */}
              <div className="border border-slate-200 rounded-sm overflow-hidden divide-y divide-slate-200 text-xs">
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <div className="p-3 bg-white">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      CHECK IN
                    </span>
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span>14 May 2026</span>
                      <Calendar className="w-3.5 h-3.5 text-[#3B3388]" />
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      CHECK OUT
                    </span>
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span>19 May 2026</span>
                      <Calendar className="w-3.5 h-3.5 text-[#3B3388]" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    GUESTS
                  </span>
                  <div className="flex items-center justify-between text-slate-700 font-medium cursor-pointer">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{guestsCount} Guests</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Promo / Offer Code Box */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  PROMO / OFFER CODE
                </label>
                <form onSubmit={handleApplyPromo} className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value);
                        setPromoError(null);
                      }}
                      placeholder="e.g. SUMMER2026"
                      className="w-full h-8 pl-8 pr-2 text-xs border border-slate-200 rounded-md outline-none focus:border-[#3B3388] uppercase tracking-wider font-mono bg-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={validatingPromo || !promoCodeInput.trim()}
                    className="h-8 px-3 bg-[#3B3388] hover:bg-[#2F296D] text-white text-[11px] font-semibold rounded-md shrink-0 cursor-pointer"
                  >
                    {validatingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                  </Button>
                </form>

                {appliedOffer && (
                  <div className="flex items-center justify-between p-2 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{appliedOffer.offerName} ({appliedOffer.discountValue})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedOffer(null);
                        setPromoCodeInput("");
                      }}
                      className="text-[10px] underline font-semibold text-emerald-700 hover:text-emerald-900 shrink-0 ml-1 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-[10px] font-medium text-rose-600 pl-0.5">
                    {promoError}
                  </p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-500 pt-1">
                <div className="flex justify-between">
                  <span>
                    {property.currency || "€"}{pricePerNight} x {nights} Nights
                  </span>
                  <span className="font-semibold text-slate-700">
                    {property.currency || "€"}{basePriceTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning Fee</span>
                  <span className="font-semibold text-slate-700">
                    {property.currency || "€"}{cleaningFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Local Taxes & Fees</span>
                  <span className="font-semibold text-slate-700">
                    {property.currency || "€"}{taxes.toFixed(2)}
                  </span>
                </div>

                {appliedOffer && (
                  <div className="flex justify-between text-emerald-600 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <span>Promo Discount</span>
                      <span className="text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded font-mono">
                        {appliedOffer.offerCode}
                      </span>
                    </span>
                    <span>-{property.currency || "€"}{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-900 text-sm">
                    Total Price
                  </span>
                  <div className="text-right">
                    {appliedOffer && (
                      <span className="block text-xs line-through text-slate-400 font-normal">
                        {property.currency || "€"}{grossTotal.toFixed(2)}
                      </span>
                    )}
                    <span className="font-bold text-lg text-[#3B3388]">
                      {property.currency || "€"}{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <Button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full h-11 bg-[#3B3388] hover:bg-[#2F296D] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-full h-11 border-slate-200 text-xs font-semibold rounded-xl transition-colors ${
                    isSaved
                      ? "bg-slate-50 text-[#3B3388] border-[#3B3388]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {isSaved ? "Saved to Favorites" : "Save Property"}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#3B3388] mb-1" />
                  <span className="text-[9px] text-slate-400 font-medium">
                    FREE CANCEL
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Zap className="w-4 h-4 text-[#3B3388] mb-1" />
                  <span className="text-[9px] text-slate-400 font-medium">
                    INSTANT BOOK
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Lock className="w-4 h-4 text-[#3B3388] mb-1" />
                  <span className="text-[9px] text-slate-400 font-medium">
                    SECURE PAY
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* BOTTOM SECTION: REVIEWS */}
        <div className="space-y-6 pt-6 border-t border-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              What Our Guests Say
            </h2>

            <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-600 bg-white shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="font-bold text-slate-800">{property.rating || 4.9}</span>
              <span className="text-slate-400">{reviews.length > 0 ? `${reviews.length} reviews` : "1,248 verified reviews"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(reviews.length > 0 ? reviews.slice(0, 3) : [
              {
                id: "1",
                rating: 5,
                comment: "An absolutely premium experience! Everything from the modern minimalist architecture to the quality of the bedding was perfect.",
                name: "Marvin McKinney",
                country: "Netherlands",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
              },
              {
                id: "2",
                rating: 5,
                comment: "Breath-taking lakeside views and top notch private sauna! Will definitely recommend to friends.",
                name: "Sophia Martinez",
                country: "Germany",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
              },
              {
                id: "3",
                rating: 5,
                comment: "Perfect location for families and group retreats. Modern, clean, and frictionless check-in.",
                name: "Alexander Wright",
                country: "United Kingdom",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop",
              },
            ]).map((review, i) => (
              <Card
                key={review._id || review.id || i}
                className="bg-white rounded-sm border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between"
              >
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < (review.rating || 5)
                            ? "fill-[#F59E0B] text-[#F59E0B]"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-4">
                    {review.comment}
                  </p>
                </CardContent>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-200">
                    <Image
                      src={getValidImageUrl(review.avatar, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop")}
                      alt={review.name || "Guest"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-[#3B3388] leading-none mb-0.5">
                      {review.name || "Verified Guest"}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-normal leading-none">
                      {review.country || "Verified Customer"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          property={{
            _id: property._id,
            title: property.title,
            pricePerNight: property.pricePerNight || 129,
            cleaningFee: property.cleaningFee,
            taxes: property.taxes,
            currency: property.currency,
            holidayPark: typeof property.holidayPark === "string" ? property.holidayPark : (property.holidayPark as any)?._id,
            holidayParkName: typeof property.holidayPark === "object" ? (property.holidayPark as any)?.name : undefined,
          }}
          initialGuests={guestsCount}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={(booking) => {
            setIsBookingModalOpen(false);
            setConfirmedBooking(booking);
            setIsConfirmationModalOpen(true);
          }}
        />
      )}

      {/* Booking Confirmation Receipt Modal */}
      {isConfirmationModalOpen && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onViewMyBookings={() => router.push("/profile")}
        />
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  Shield,
  Globe,
  Award,
  Lock,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";
import { fetchActiveOffers } from "../api/offers.api";
import { Offer } from "../types/offers.types";
import { fetchProperties } from "@/features/properties/api/properties.api";
import { getHolidayParks } from "@/features/holiday-parks/api/holiday-parks.api";
import { Property } from "@/features/properties/types/properties.types";
import { HolidayPark } from "@/features/holiday-parks/types";
import { subscribeToNewsletter } from "@/features/newsletter/api/newsletter.api";
import { getValidImageUrl } from "@/lib/utils";

// Curated fallback data for static perk labels & distinct design slots
const FEATURED_SEASONAL_FALLBACKS = [
  {
    id: "summer-escape",
    badge: "LIMITED TIME",
    category: "VALENTINE'S SPECIAL",
    title: "Summer Escape Package",
    description:
      "Enjoy a luxurious coastal getaway with private infinity pool access, daily gourmet breakfast, and complimentary boat excursions.",
    perks: ["Breakfast Included", "Free Spa Credit (€50)", "Late Check-out"],
    price: "€1,200",
    period: "/stay",
    code: "SUMMER2026",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "romantic-getaway",
    badge: "BEST VALUE",
    category: "ROMANTIC SPECIAL",
    title: "Romantic Getaway Package",
    description:
      "Escape into a private mountain sanctuary with candlelight dinners, champagne on arrival, and exclusive thermal bath access for couples.",
    perks: ["Champagne & Flowers", "Candlelight Dinner", "Late Check-out"],
    price: "€1,050",
    period: "/stay",
    code: "ROMANCE20",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "snowy-retreat",
    badge: "EARLY BIRD",
    category: "WINTER ESCAPE",
    title: "Snowy Retreat Package",
    description:
      "Immerse yourself in Alpine luxury with ski-in/ski-out chalet access, private sauna, heated infinity pool, and nightly wine tastings.",
    perks: ["Ski Passes Included", "Sauna & Heated Pool", "Alpine Welcome Basket"],
    price: "€1,350",
    period: "/stay",
    code: "ALPINE15",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
  },
];

// Why Book With Us grid items
const WHY_BOOK_WITH_US = [
  {
    icon: Award,
    title: "Best Holiday Experiences",
    description:
      "Handpicked luxury holiday parks and villas adhering to strict 5-star quality and comfort standards.",
  },
  {
    icon: Shield,
    title: "Luxury Resort Partners",
    description:
      "Direct partnerships with world-class resort hosts offering VIP room upgrades and guest perks.",
  },
  {
    icon: Lock,
    title: "Secure Online Booking",
    description:
      "Encrypted 256-bit instant checkout with flexible cancellations and no hidden transaction fees.",
  },
  {
    icon: Tag,
    title: "Exclusive Seasonal Offers",
    description:
      "Access secret discount codes, seasonal promotions, and special package inclusions unavailable elsewhere.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Personalized multilingual assistance across 11 global languages for smooth holiday planning.",
  },
  {
    icon: Headphones,
    title: "Premium Concierge Service",
    description:
      "Dedicated concierge support to curate custom itineraries, airport transfers, and private dining.",
  },
];

// Special Resort Packages Grid Fallbacks (Unique Slots)
const SPECIAL_PACKAGES_FALLBACKS = [
  {
    id: "wellness-retreat",
    badge: "WELLNESS RETREAT",
    title: "Wellness & Spa Package",
    description:
      "Rejuvenate your body and mind with unlimited thermal spa access and daily wellness treatments.",
    perks: ["Daily Breakfast & Dinner", "Complimentary Spa Access", "Airport Shuttle Transfer"],
    price: "€1,100",
    period: "/stay",
    code: "WELLNESS10",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "coastal-escape",
    badge: "COASTAL GETAWAY",
    title: "Coastal Luxury Package",
    description:
      "Wake up to ocean views with sea-front villa accommodations and complimentary catamaran cruises.",
    perks: ["Sea View Suite Upgrade", "Daily Gourmet Breakfast", "Sunset Catamaran Tour"],
    price: "€1,450",
    period: "/stay",
    code: "COASTAL15",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "romantic-escapes",
    badge: "ROMANTIC ESCAPE",
    title: "Romantic Escapes Package",
    description:
      "Intimate retreat featuring private Jacuzzi villas, champagne breakfasts, and spa therapy.",
    perks: ["Private Hot Tub Cabin", "Candlelight Dinner", "Welcome Wine Basket"],
    price: "€1,250",
    period: "/stay",
    code: "LOVE2026",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "heritage-village",
    badge: "HERITAGE STAY",
    title: "Heritage Village Package",
    description:
      "Immerse yourself in historic charm with wine tastings, guided tours, and authentic regional cuisine.",
    perks: ["Historic Villa Stay", "Local Vineyard Tour", "Breakfast Included"],
    price: "€1,020",
    period: "/stay",
    code: "HERITAGE10",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "lakeside-haven",
    badge: "SPA & WELLNESS",
    title: "Lakeside Haven Package",
    description:
      "Peaceful lake-front lodges with private dock access, kayaking, and evening fireside cocktails.",
    perks: ["Private Lake Access", "Thermal Bath Access", "Complimentary Kayaks"],
    price: "€1,180",
    period: "/stay",
    code: "LAKE2026",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "seaside-romance",
    badge: "ALPINE RETREAT",
    title: "Seaside Romance Package",
    description:
      "Luxurious beachside suites with cliffside ocean views, private balconies, and hydrotherapy spa.",
    perks: ["Oceanfront Balcony", "Massage Therapy", "Free Airport Transfer"],
    price: "€1,320",
    period: "/stay",
    code: "SEASIDE15",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
  },
];

export function OffersPageClient() {
  const [apiOffers, setApiOffers] = useState<Offer[]>([]);
  const [dynamicProperties, setDynamicProperties] = useState<Property[]>([]);
  const [dynamicParks, setDynamicParks] = useState<HolidayPark[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDynamicData() {
      try {
        setLoading(true);
        const [offersData, propsData, parksData] = await Promise.all([
          fetchActiveOffers().catch(() => []),
          fetchProperties({ limit: 12 }).catch(() => ({ items: [], meta: { total: 0, page: 1, limit: 12, totalPages: 1 } })),
          getHolidayParks({ limit: 6 }).catch(() => ({ items: [], meta: { totalItems: 0, itemPages: 1, currentPage: 1, itemsPerPage: 6 } })),
        ]);

        setApiOffers(offersData || []);
        setDynamicProperties(propsData?.items || []);
        setDynamicParks(parksData?.items || []);
      } catch (err) {
        console.error("Failed to load dynamic offers/properties data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDynamicData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterSubmitting(true);
    setNewsletterSuccess(null);
    setNewsletterError(null);

    try {
      await subscribeToNewsletter({ email: newsletterEmail });
      setNewsletterSuccess("Thank you! You've been subscribed to exclusive offer updates.");
      setNewsletterEmail("");
    } catch (err: any) {
      setNewsletterError(err?.response?.data?.message || "Failed to subscribe. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  // Strictly partition API offers by displayPlacement choice
  const featuredApiOffers = apiOffers.filter((o) => o.displayPlacement !== "special_packages");
  const specialPackageApiOffers = apiOffers.filter((o) => o.displayPlacement === "special_packages");

  // Strictly partition dynamic properties as fallback
  const featuredProperties = dynamicProperties.slice(0, 3);
  const specialPackagesProperties = dynamicProperties.slice(3, 9);

  return (
    <div className="w-full bg-slate-50 font-sans selection:bg-[#30277a] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[520px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/offer-hero.png"
          alt="Luxury Resort Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-slate-950/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Exclusive Seasonal Promotions</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
            Escape More. Experience More.
          </h1>

          <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover exclusive seasonal promotions, resort packages, and limited-time discounts tailored for your luxury getaway.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#featured-offers"
              className="px-8 py-3.5 bg-[#30277a] hover:bg-[#231b5c] text-white text-sm font-extrabold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              Explore Offers
            </a>
            <a
              href="#special-packages"
              className="px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white text-sm font-extrabold rounded-xl border border-white/30 backdrop-blur-md transition-all cursor-pointer"
            >
              Book With Code
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* 2. FEATURED SEASONAL OFFERS */}
        <section id="featured-offers" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Seasonal Offers
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Handpicked luxury experiences crafted for every season. Book early to secure exclusive perks and rates.
            </p>
          </div>

          <div className="space-y-8">
            {FEATURED_SEASONAL_FALLBACKS.map((fallback, idx) => {
              const apiOffer = featuredApiOffers[idx];
              const dynProp = featuredProperties[idx];
              const dynPark = dynamicParks[idx];

              // Check if offer has populated properties or parks attached
              const offerProp = apiOffer?.applicableProperties?.find((p) => typeof p === "object") as any;
              const offerPark = apiOffer?.applicableParks?.find((p) => typeof p === "object") as any;

              const title = apiOffer?.offerName || offerProp?.title || offerPark?.title || dynProp?.title || dynPark?.title || fallback.title;
              const category = offerProp?.category || dynProp?.category || dynPark?.location?.country || fallback.category;
              const description = apiOffer?.description || offerProp?.description || dynProp?.description || dynPark?.shortDescription || fallback.description;
              const code = apiOffer?.offerCode || fallback.code;

              const rawImg = offerProp?.gallery?.[0] || offerPark?.coverImage || dynProp?.gallery?.main || dynPark?.coverImage || fallback.image;
              const imageSrc = getValidImageUrl(rawImg);

              const rawPrice = offerProp?.pricePerNight ? `€${offerProp.pricePerNight}` : offerPark?.startingPrice ? `€${offerPark.startingPrice}` : apiOffer?.discountValue ? apiOffer.discountValue : dynProp?.pricePerNight ? `€${dynProp.pricePerNight}` : fallback.price;

              const perks: string[] = offerProp?.amenities?.length >= 2
                ? offerProp.amenities.slice(0, 3).map((a: any) => typeof a === "object" ? a.name : a)
                : dynProp?.amenities && dynProp.amenities.length >= 2
                  ? dynProp.amenities.slice(0, 3).map((a) => a.name)
                  : fallback.perks;

              const targetLink = offerProp?._id
                ? `/property/${offerProp._id}`
                : offerPark?._id
                  ? `/holiday-parks/${offerPark._id}`
                  : dynProp?._id
                    ? `/property/${dynProp._id}`
                    : `/search?offerCode=${code}`;

              return (
                <div
                  key={apiOffer?._id || fallback.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group"
                >
                  {/* Left Half: Image */}
                  <div className="relative lg:col-span-6 h-64 lg:h-auto min-h-[280px] overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="px-3.5 py-1.5 bg-[#30277a] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg shadow-md">
                        {fallback.badge}
                      </span>
                    </div>
                  </div>

                  {/* Right Half: Details & CTA */}
                  <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block">
                        {category}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#30277a] transition-colors leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {description}
                      </p>

                      {/* Perk Badges */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {perks.map((perkItem: string, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{perkItem}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Row: Code, Price & Book CTA */}
                    <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-medium">Promo Code:</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(code)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-dashed border-indigo-200 rounded-md font-mono font-bold text-xs text-[#30277a] hover:bg-indigo-100 transition-colors cursor-pointer"
                            title="Click to copy promo code"
                          >
                            <Tag size={12} />
                            <span>{code}</span>
                            {copiedCode === code ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} className="text-slate-400" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-400 font-medium">Starting from</span>
                          <span className="text-2xl font-black text-slate-900">{rawPrice}</span>
                          <span className="text-xs text-slate-500 font-medium">{fallback.period}</span>
                        </div>
                      </div>

                      <Link
                        href={targetLink}
                        className="px-6 py-3 bg-[#30277a] hover:bg-[#231b5c] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <span>Book Package</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. WHY BOOK WITH US */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Why Book With Us
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Unmatched luxury, seamless booking, and exclusive benefits when you reserve directly with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_BOOK_WITH_US.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200/90 rounded-2xl p-7 space-y-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#30277a] flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                    <IconComp size={22} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SPECIAL RESORT PACKAGES */}
        <section id="special-packages" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Special Resort Packages
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Explore curated packages featuring wellness, gastronomy, adventure, and family getaways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SPECIAL_PACKAGES_FALLBACKS.map((fallback, idx) => {
              const apiOffer = specialPackageApiOffers[idx];
              const dynProp = specialPackagesProperties[idx];
              const parkIdx = idx + 3;
              const dynPark = dynamicParks[parkIdx];

              // Check if offer has populated properties or parks attached
              const offerProp = apiOffer?.applicableProperties?.find((p) => typeof p === "object") as any;
              const offerPark = apiOffer?.applicableParks?.find((p) => typeof p === "object") as any;

              const title = apiOffer?.offerName || offerProp?.title || offerPark?.title || dynProp?.title || dynPark?.title || fallback.title;
              const category = offerProp?.category || dynProp?.category || fallback.badge;
              const description = apiOffer?.description || offerProp?.description || dynProp?.description || dynPark?.shortDescription || fallback.description;
              const priceText = offerProp?.pricePerNight ? `€${offerProp.pricePerNight}` : offerPark?.startingPrice ? `€${offerPark.startingPrice}` : apiOffer?.discountValue ? apiOffer.discountValue : dynProp?.pricePerNight ? `€${dynProp.pricePerNight}` : fallback.price;
              const code = apiOffer?.offerCode || fallback.code;

              const rawImg = offerProp?.gallery?.[0] || offerPark?.coverImage || dynProp?.gallery?.main || dynPark?.coverImage || fallback.image;
              const imageSrc = getValidImageUrl(rawImg);

              const perks: string[] = offerProp?.amenities?.length >= 2
                ? offerProp.amenities.slice(0, 3).map((a: any) => typeof a === "object" ? a.name : a)
                : dynProp?.amenities && dynProp.amenities.length >= 2
                  ? dynProp.amenities.slice(0, 3).map((a) => a.name)
                  : fallback.perks;

              const targetLink = offerProp?._id
                ? `/property/${offerProp._id}`
                : offerPark?._id
                  ? `/holiday-parks/${offerPark._id}`
                  : dynProp?._id
                    ? `/property/${dynProp._id}`
                    : `/search?offerCode=${code}`;

              return (
                <div
                  key={apiOffer?._id || fallback.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image Header */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-white/50 shadow-sm">
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#30277a] transition-colors leading-snug line-clamp-1">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{description}</p>

                      <div className="space-y-1.5 pt-1">
                        {perks.map((perkItem: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle2 size={13} className="text-indigo-600 shrink-0" />
                            <span className="line-clamp-1">{perkItem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Action Row */}
                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Starting from
                        </span>
                        <p className="text-lg font-black text-slate-900">
                          {priceText}{" "}
                          <span className="text-xs font-medium text-slate-400">{fallback.period}</span>
                        </p>
                      </div>

                      <Link
                        href={targetLink}
                        className="px-4 py-2.5 bg-[#30277a] hover:bg-[#231b5c] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Book Package
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 5. GET EXCLUSIVE HOLIDAY DEALS NEWSLETTER BANNER */}
      <section className="relative w-full py-20 bg-slate-950 overflow-hidden text-white font-sans">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
          alt="Exclusive Holiday Deals Background"
          fill
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/75" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Get Exclusive Holiday Deals
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Subscribe to our newsletter to receive access to secret deals, member-only discounts, and special seasonal promos straight to your inbox.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 outline-none focus:bg-white/20 focus:border-white transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="w-full sm:w-auto shrink-0 h-12 px-7 bg-[#30277a] hover:bg-[#231b5c] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Subscribe</span>
                <Send size={13} />
              </button>
            </div>

            {newsletterSuccess && (
              <p className="text-xs text-emerald-400 font-semibold">{newsletterSuccess}</p>
            )}
            {newsletterError && (
              <p className="text-xs text-rose-400 font-semibold">{newsletterError}</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

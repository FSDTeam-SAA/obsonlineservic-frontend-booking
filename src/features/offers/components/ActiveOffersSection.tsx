"use client";

import React, { useEffect, useState } from "react";
import { Tag, Copy, Check, Sparkles, Calendar } from "lucide-react";
import { fetchActiveOffers } from "../api/offers.api";
import { Offer } from "../types/offers.types";
import { ActiveOffersSkeleton } from "./ActiveOffersSkeleton";

export function ActiveOffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadOffers() {
      try {
        setLoading(true);
        const data = await fetchActiveOffers();
        if (isMounted) {
          setOffers(data || []);
        }
      } catch (err) {
        console.error("Failed to load active offers:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (loading) {
    return <ActiveOffersSkeleton />;
  }

  if (!offers.length) {
    return null; // Gracefully hide section if no active offers exist
  }

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/80 to-white rounded-3xl border border-slate-100 shadow-xs my-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B3388]/10 text-[#3B3388] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVE PROMOTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Seasonal Deals & Special Offers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Unlock instant savings on your luxury escape. Apply promo codes directly at checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#3B3388]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#3B3388] transition-colors leading-snug">
                    {offer.offerName}
                  </h3>
                  <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {offer.discountValue || `${offer.discountPercentage}% OFF`}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {offer.description || "Enjoy incredible savings on your luxury holiday experience."}
                </p>

                {offer.validUntil && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>
                      Valid until {new Date(offer.validUntil).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>

              {offer.offerCode && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 bg-slate-50 border border-dashed border-slate-300 px-3 py-1.5 rounded-lg">
                    <Tag className="w-3.5 h-3.5 text-[#3B3388]" />
                    <span className="font-mono font-bold text-xs text-slate-800 tracking-wider uppercase">
                      {offer.offerCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(offer.offerCode!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B3388] hover:bg-[#2F296D] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    {copiedCode === offer.offerCode ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

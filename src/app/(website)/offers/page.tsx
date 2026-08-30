import React, { Suspense } from "react";
import { Metadata } from "next";
import { OffersPageClient } from "@/features/offers/components/OffersPageClient";
import { ActiveOffersSkeleton } from "@/features/offers/components/ActiveOffersSkeleton";

export const metadata: Metadata = {
  title: "Special Offers & Packages | Booking is Yours",
  description:
    "Discover exclusive seasonal promotions, luxury resort packages, and limited-time discount codes for your next holiday getaway.",
};

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Suspense fallback={<ActiveOffersSkeleton />}>
        <OffersPageClient />
      </Suspense>
    </main>
  );
}

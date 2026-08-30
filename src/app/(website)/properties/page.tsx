import React, { Suspense } from "react";
import { Metadata } from "next";
import { PropertyCatalogue } from "@/features/properties/components/PropertyCatalogue";
import { PropertiesGridSkeleton } from "@/features/properties/components/PropertySkeleton";

export const metadata: Metadata = {
  title: "Explore Holiday Homes & Luxury Villas | OBS Online Services",
  description:
    "Browse our full catalogue of luxury holiday homes, lakefront chalets, and forest lodges. Search and filter by destination, guests, and amenities.",
};

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto space-y-6">
            <div className="h-8 w-64 bg-slate-200 rounded-md animate-pulse" />
            <PropertiesGridSkeleton count={8} />
          </div>
        </div>
      }
    >
      <PropertyCatalogue />
    </Suspense>
  );
}

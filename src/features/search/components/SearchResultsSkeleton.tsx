"use client";

import React from "react";
import { PropertiesGridSkeleton } from "@/features/properties/components/PropertySkeleton";

export function SearchResultsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="h-10 w-full sm:w-80 bg-slate-200 rounded-xl animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />

        <PropertiesGridSkeleton count={8} />
      </div>
    </div>
  );
}

import React from 'react';

export function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 animate-pulse">
      <div className="container mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[460px] rounded-sm overflow-hidden bg-slate-200">
              <div className="md:col-span-8 bg-slate-300 h-full" />
              <div className="md:col-span-4 grid grid-rows-3 gap-3 h-full">
                <div className="bg-slate-300 h-full" />
                <div className="bg-slate-300 h-full" />
                <div className="bg-slate-300 h-full" />
              </div>
            </div>

            {/* Header info */}
            <div className="space-y-3">
              <div className="h-8 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-16 bg-slate-200 rounded w-full" />
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-24 bg-slate-200 rounded-sm" />
              ))}
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="h-8 bg-slate-200 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Booking Card Skeleton */}
          <div className="lg:col-span-4">
            <div className="rounded-sm border border-slate-200/80 bg-white p-6 space-y-6">
              <div className="h-8 bg-slate-200 rounded w-1/2" />
              <div className="h-28 bg-slate-200 rounded" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-200 rounded" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
              </div>
              <div className="h-11 bg-slate-300 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

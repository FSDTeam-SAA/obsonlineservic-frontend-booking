import React from "react";

export function HolidayParkCardSkeleton() {
  return (
    <div className="h-full border-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-sm overflow-hidden bg-white flex flex-col justify-between animate-pulse">
      <div>
        <div className="relative h-[210px] w-full bg-slate-200" />
        <div className="p-5 pb-3 space-y-3">
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-5/6" />
          <div className="flex justify-between pt-4 pb-2 border-b border-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-slate-200" />
            ))}
          </div>
          <div className="flex justify-between pt-3">
            <div className="h-6 bg-slate-200 rounded w-20" />
            <div className="h-4 bg-slate-200 rounded w-28" />
          </div>
        </div>
      </div>
      <div className="p-5 pt-0">
        <div className="h-10 bg-slate-200 rounded w-full" />
      </div>
    </div>
  );
}

export function HolidayParkDetailSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-8 p-6">
      <div className="h-[400px] bg-slate-200 rounded-lg w-full" />
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
      </div>
    </div>
  );
}

export function DestinationCardSkeleton() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-sm bg-slate-200 shadow-xs animate-pulse">
      <div className="absolute top-3.5 left-3.5 h-6 w-28 bg-slate-300/70 rounded-md" />
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
        <div className="h-3 bg-slate-300/70 rounded w-16" />
        <div className="h-6 bg-slate-300/80 rounded w-32" />
      </div>
    </div>
  );
}

export function FeaturedDestinationsGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <DestinationCardSkeleton key={idx} />
      ))}
    </div>
  );
}


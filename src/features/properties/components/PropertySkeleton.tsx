import React from 'react';

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-slate-200/70 bg-white p-0 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between animate-pulse">
      <div>
        {/* Top Image Box */}
        <div className="h-[200px] w-full bg-slate-200" />
        {/* Content Body */}
        <div className="p-5 pb-3 space-y-3">
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
          <div className="flex justify-between pt-1 pb-1">
            <div className="h-3 bg-slate-100 rounded w-1/5" />
            <div className="h-3 bg-slate-100 rounded w-1/5" />
            <div className="h-3 bg-slate-100 rounded w-1/5" />
            <div className="h-3 bg-slate-100 rounded w-1/5" />
          </div>
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
        </div>
      </div>
      <div className="p-5 pt-1 grid grid-cols-2 gap-2.5">
        <div className="h-9 bg-slate-200 rounded-sm" />
        <div className="h-9 bg-slate-200 rounded-sm" />
      </div>
    </div>
  );
}

export function PropertiesGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <PropertyCardSkeleton key={idx} />
      ))}
    </div>
  );
}

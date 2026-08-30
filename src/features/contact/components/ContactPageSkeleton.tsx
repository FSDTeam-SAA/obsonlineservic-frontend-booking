import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ContactPageSkeleton() {
  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans">
      {/* Hero Skeleton */}
      <div className="w-full h-[320px] md:h-[400px] bg-slate-200 animate-pulse relative flex flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="h-10 w-3/4 max-w-xl bg-slate-300 rounded-md" />
        <Skeleton className="h-4 w-full max-w-2xl bg-slate-300 rounded-md" />
        <Skeleton className="h-4 w-2/3 max-w-lg bg-slate-300 rounded-md" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Form & Featured Showcase Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Form Box Skeleton */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
            <Skeleton className="h-7 w-48 bg-slate-200 rounded-md" />
            <Skeleton className="h-4 w-full max-w-sm bg-slate-200 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full bg-slate-100 rounded-lg" />
              <Skeleton className="h-11 w-full bg-slate-100 rounded-lg" />
              <Skeleton className="h-11 w-full bg-slate-100 rounded-lg" />
              <Skeleton className="h-11 w-full bg-slate-100 rounded-lg" />
              <Skeleton className="h-11 w-full bg-slate-100 rounded-lg" />
              <Skeleton className="h-11 w-full bg-slate-100 rounded-lg" />
            </div>
            <Skeleton className="h-28 w-full bg-slate-100 rounded-lg" />
            <Skeleton className="h-12 w-full bg-slate-200 rounded-lg" />
          </div>

          {/* Right Featured Resort Skeleton */}
          <div className="bg-slate-200 h-[500px] lg:h-auto rounded-2xl animate-pulse relative p-6 flex flex-col justify-end">
            <Skeleton className="h-32 w-full bg-slate-300/60 rounded-xl" />
          </div>
        </div>

        {/* Concierge Cards Skeleton */}
        <div className="space-y-6 text-center">
          <Skeleton className="h-8 w-64 mx-auto bg-slate-200 rounded-md" />
          <Skeleton className="h-4 w-96 mx-auto bg-slate-200 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <Skeleton className="h-36 w-full bg-white rounded-xl border border-slate-200" />
            <Skeleton className="h-36 w-full bg-white rounded-xl border border-slate-200" />
            <Skeleton className="h-36 w-full bg-white rounded-xl border border-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

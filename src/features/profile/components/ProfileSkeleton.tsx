import React from "react";

export function ProfileSkeleton() {
  return (
    <div className="w-full min-h-[60vh] bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-200">
          <div className="w-24 h-24 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-3 w-full max-w-sm text-center sm:text-left">
            <div className="h-7 bg-slate-200 rounded w-1/2 mx-auto sm:mx-0" />
            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Form Fields Grid Skeleton */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-11 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/12" />
            <div className="h-24 bg-slate-200 rounded w-full" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <div className="h-10 bg-slate-200 rounded w-24" />
            <div className="h-10 bg-slate-200 rounded w-32" />
          </div>
        </div>

        {/* Danger Zone Skeleton */}
        <div className="bg-red-50/30 border border-red-200/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 w-full max-w-md">
            <div className="h-5 bg-red-200/50 rounded w-1/3" />
            <div className="h-4 bg-red-200/30 rounded w-3/4" />
          </div>
          <div className="h-10 bg-red-250/50 rounded w-32 shrink-0" />
        </div>
      </div>
    </div>
  );
}

import React from "react";

export function BookingSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs animate-pulse space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-slate-200 rounded-md" />
          <div className="h-3 w-24 bg-slate-100 rounded-md" />
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
        <div className="space-y-1.5">
          <div className="h-3 w-16 bg-slate-100 rounded-md" />
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-16 bg-slate-100 rounded-md" />
          <div className="h-4 w-36 bg-slate-200 rounded-md" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-16 bg-slate-100 rounded-md" />
          <div className="h-4 w-20 bg-slate-200 rounded-md" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <div className="h-9 w-24 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}

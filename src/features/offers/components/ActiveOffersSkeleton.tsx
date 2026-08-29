import React from "react";

export function ActiveOffersSkeleton() {
  return (
    <div className="w-full py-10 bg-slate-50/50 rounded-2xl p-6 border border-slate-100 animate-pulse space-y-6">
      <div className="flex flex-col items-center text-center space-y-2 max-w-md mx-auto">
        <div className="h-4 w-32 bg-slate-200 rounded-full" />
        <div className="h-7 w-64 bg-slate-200 rounded-lg" />
        <div className="h-3.5 w-80 bg-slate-200 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-slate-200/70 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-6 w-3/5 bg-slate-200 rounded-md" />
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="h-3.5 w-full bg-slate-200 rounded-md" />
              <div className="h-3.5 w-4/5 bg-slate-200 rounded-md" />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="h-8 w-28 bg-slate-200 rounded-md" />
              <div className="h-8 w-24 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

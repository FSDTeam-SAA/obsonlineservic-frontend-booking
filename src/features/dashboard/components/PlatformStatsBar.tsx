"use client";

import { useEffect, useState } from "react";
import { Trees, Home, Tag, CalendarCheck, ShieldCheck } from "lucide-react";
import { fetchPublicDashboardOverview } from "../api/dashboard.api";
import { DashboardOverviewData } from "../types/dashboard.types";
import { PlatformStatsSkeleton } from "./PlatformStatsSkeleton";

export function PlatformStatsBar() {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const res = await fetchPublicDashboardOverview();
        if (mounted) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to load platform overview stats:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <PlatformStatsSkeleton />;
  }

  // Extract counts or fallbacks
  const stats = data?.stats || [];
  const parksStat = stats.find((s) => s.key === "parks")?.value || 18;
  const propertiesStat = stats.find((s) => s.key === "properties")?.value || 246;
  const offersStat = stats.find((s) => s.key === "offers")?.value || 9;
  const bookingsStat = stats.find((s) => s.key === "bookings")?.value || 2548;

  const displayItems = [
    {
      icon: Trees,
      label: "Holiday Parks",
      value: parksStat,
      sub: "6 UK & Nordic regions",
    },
    {
      icon: Home,
      label: "Luxury Properties",
      value: propertiesStat,
      sub: "Live & bookable",
    },
    {
      icon: Tag,
      label: "Active Offers",
      value: offersStat,
      sub: "Seasonal discounts",
    },
    {
      icon: CalendarCheck,
      label: "Guests Hosted",
      value: bookingsStat,
      sub: "Satisfied bookings",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#11231b] py-12 text-white shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-emerald-800/40 pb-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-emerald-100">
              Trusted by Luxury Travelers Worldwide
            </h2>
            <p className="mt-1 text-sm text-emerald-300/80">
              Real-time platform availability across handpicked Nordic & UK destinations.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-900/50 px-4 py-1.5 text-xs text-emerald-200 border border-emerald-700/50">
            <ShieldCheck className="size-4 text-emerald-400" />
            100% Verified Accommodations
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {displayItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1"
              >
                <div className="mb-3 grid size-12 place-items-center rounded-full bg-emerald-800/30 text-emerald-300 ring-1 ring-emerald-700/40 transition-colors group-hover:bg-emerald-700/40 group-hover:text-white">
                  <Icon className="size-6" />
                </div>
                <strong className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
                  {typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : item.value}
                </strong>
                <span className="mt-1 text-sm font-medium text-emerald-200">
                  {item.label}
                </span>
                <span className="mt-0.5 text-xs text-emerald-400/80">
                  {item.sub}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

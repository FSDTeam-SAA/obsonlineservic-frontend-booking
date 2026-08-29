"use client";

import React from "react";
import { Search, Home, CreditCard, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ==========================================
// 1. JSON DATA CONFIGURATION
// ==========================================
export interface BookingStep {
  id: string;
  stepNumber: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const bookingProcessData = {
  heading: "Our Booking Process",
  subheading: "Four simple steps to secure your premium Scandinavian holiday.",
  steps: [
    {
      id: "1",
      stepNumber: 1,
      icon: Search,
      title: "Search",
      description:
        "Filter by destination, holiday park, dates, and number of guests.",
    },
    {
      id: "2",
      stepNumber: 2,
      icon: Home,
      title: "Select Property",
      description:
        "Choose from our curated catalog of luxury cabins, lodges, and villas.",
    },
    {
      id: "3",
      stepNumber: 3,
      icon: CreditCard,
      title: "Secure Payment",
      description:
        "Complete your reservation instantly using our secure luxury gateway.",
    },
    {
      id: "4",
      stepNumber: 4,
      icon: Sparkles,
      title: "Enjoy Your Holiday",
      description:
        "Receive your digital welcome pack, offline access keys, and escape.",
    },
  ],
};

interface BookingProcessProps {
  data?: typeof bookingProcessData;
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function BookingProcessSection({
  data = bookingProcessData,
}: BookingProcessProps) {
  return (
    <section id="booking" className="w-full bg-[#EEF2F6] py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
            {data.heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {data.subheading}
          </p>
        </div>

        {/* 4-Step Process Flow Grid with Connecting Lines */}
        <div className="relative">
          {/* Subtle Horizontal Connector Line (Visible on Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-slate-900 -translate-y-1/2 z-0 px-16 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {data.steps.map((step) => {
              const Icon = step.icon;

              return (
                <Card
                  key={step.id}
                  className="bg-white rounded-sm border-none shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 text-center p-8 flex flex-col items-center justify-center min-h-[220px]"
                >
                  <CardContent className="p-0 flex flex-col items-center">
                    {/* Icon Container with Soft Background */}
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF2F9] flex items-center justify-center text-[#403B8D] mb-5 shrink-0">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>

                    {/* Step Title */}
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-[220px]">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

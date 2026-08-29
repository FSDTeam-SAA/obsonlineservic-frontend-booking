"use client";

import React from "react";
import {
  Leaf,
  UtensilsCrossed,
  Waves,
  Bike,
  Trees,
  Umbrella,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ==========================================
// 1. JSON DATA CONFIGURATION
// ==========================================
export interface AmenityItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const resortAmenitiesData = {
  heading: "Every comfort, quietly considered",
  subheading:
    "Every amenity is carefully curated to elevate your forest stay, blending modern luxury with natural surroundings.",
  amenities: [
    {
      id: "1",
      icon: Leaf,
      title: "Forest Spa & Wellness",
      description:
        "Rejuvenate with organic herbal saunas, outdoor hot tubs, and massage therapies overlooking the pine forest.",
    },
    {
      id: "2",
      icon: UtensilsCrossed,
      title: "The Wildwood Restaurant",
      description:
        "Savor exquisite organic farm-to-table dishes prepared by award-winning chefs using locally sourced wild ingredients.",
    },
    {
      id: "3",
      icon: Waves,
      title: "Heated Natural Pool",
      description:
        "Swim in our gorgeous eco-pool, naturally heated and integrated perfectly into the surrounding landscape.",
    },
    {
      id: "4",
      icon: Bike,
      title: "Premium Bike Rental",
      description:
        "Explore miles of dedicated national park trails with our fleet of premium mountain and electric bikes.",
    },
    {
      id: "5",
      icon: Trees,
      title: "Nature Adventure Park",
      description:
        "A safe, creative outdoor play sanctuary crafted from natural timbers to spark children's imagination.",
    },
    {
      id: "6",
      icon: Umbrella,
      title: "Private Lakeside Beach",
      description:
        "Relax on the sandy shores of our crystal lake, featuring a private wooden deck, paddleboards, and cozy fire pits.",
    },
  ],
};

interface ResortAmenitiesProps {
  data?: typeof resortAmenitiesData;
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function ResortAmenitiesSection({
  data = resortAmenitiesData,
}: ResortAmenitiesProps) {
  return (
    <section className="w-full bg-[#EEF2F6] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#1E293B]">
            {data.heading}
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed md:text-right max-w-md">
            {data.subheading}
          </p>
        </div>

        {/* 6-Card Amenities Grid (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.amenities.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.id}
                className="bg-white rounded-2xl border-none shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 p-7 flex flex-col justify-start min-h-[175px]"
              >
                <CardContent className="p-0 space-y-3.5">
                  {/* Subtle Circular Icon Container */}
                  <div className="w-10 h-10 rounded-full bg-[#EEF2F9] flex items-center justify-center text-[#403B8D] shrink-0">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}

"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Sparkles, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ==========================================
// 1. JSON DATA CONFIGURATION
// ==========================================
export interface FeatureItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const whyChooseUsData = {
  heading: "Why Choose Nordic Haven",
  subheading:
    "We redefine the holiday resort experience with premium hospitality and seamless digital convenience.",
  features: [
    {
      id: "1",
      icon: CheckCircle2,
      title: "Instant Online Booking",
      description:
        "Real-time availability and immediate confirmation. No waiting, no hidden fees.",
    },
    {
      id: "2",
      icon: ShieldCheck,
      title: "Best Price Guarantee",
      description:
        "Book directly through our website to enjoy the guaranteed lowest rates on all luxury properties.",
    },
    {
      id: "3",
      icon: Sparkles,
      title: "Luxury Holiday Experiences",
      description:
        "Curated activities, premium wellness facilities, and high-end design in every accommodation.",
    },
    {
      id: "4",
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Fully encrypted checkout supporting Visa, Mastercard, Apple Pay, and local bank transfers.",
    },
  ],
};

interface WhyChooseUsProps {
  data?: typeof whyChooseUsData;
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function WhyChooseNordicHaven({
  data = whyChooseUsData,
}: WhyChooseUsProps) {
  return (
    <section id="about-us" className="w-full bg-[#EEF2F6] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
            {data.heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {data.subheading}
          </p>
        </div>

        {/* 4-Column Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.id}
                className="bg-white rounded-sm border-none shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 text-center p-8 flex flex-col items-center justify-start min-h-[260px]"
              >
                <CardContent className="p-0 flex flex-col items-center">
                  {/* Circular Icon Wrapper */}
                  <div className="w-12 h-12 rounded-full bg-[#EBF0F8] flex items-center justify-center text-[#3B3388] mb-5 shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 mb-2.5">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {feature.description}
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

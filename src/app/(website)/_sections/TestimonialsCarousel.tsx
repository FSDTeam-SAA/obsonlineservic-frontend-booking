"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// ==========================================
// 1. JSON DATA CONFIGURATION
// ==========================================
export interface TestimonialItem {
  id: string;
  rating: number;
  maxRating: number;
  reviewText: string;
  userName: string;
  userCountry: string;
  avatarUrl: string;
}

export const testimonialsData = {
  heading: "What Our Guests Say",
  subheading:
    "Read real experiences from affluent travelers who found their perfect sanctuary with us.",
  reviews: [
    {
      id: "1",
      rating: 4,
      maxRating: 5,
      reviewText:
        "An absolutely premium experience! Everything from the modern minimalist architecture to the quality of the bedding was perfect.",
      userName: "Marvin McKinney",
      userCountry: "Netherlands",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "2",
      rating: 4,
      maxRating: 5,
      reviewText:
        "An absolutely premium experience! Everything from the modern minimalist architecture to the quality of the bedding was perfect.",
      userName: "Marvin McKinney",
      userCountry: "Netherlands",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "3",
      rating: 4,
      maxRating: 5,
      reviewText:
        "An absolutely premium experience! Everything from the modern minimalist architecture to the quality of the bedding was perfect.",
      userName: "Marvin McKinney",
      userCountry: "Netherlands",
      avatarUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "4",
      rating: 4,
      maxRating: 5,
      reviewText:
        "An absolutely premium experience! Everything from the modern minimalist architecture to the quality of the bedding was perfect.",
      userName: "Marvin McKinney",
      userCountry: "Netherlands",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "5",
      rating: 4,
      maxRating: 5,
      reviewText:
        "An absolutely premium experience! Everything from the modern minimalist architecture to the quality of the bedding was perfect.",
      userName: "Marvin McKinney",
      userCountry: "Netherlands",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "6",
      rating: 4,
      maxRating: 5,
      reviewText:
        "An absolutely premium experience! Everything from the modern minimalist architecture to the quality of the bedding was perfect.",
      userName: "Marvin McKinney",
      userCountry: "Netherlands",
      avatarUrl:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
    },
  ],
};

interface TestimonialsSectionProps {
  data?: typeof testimonialsData;
}

// ==========================================
// 2. MAIN COMPONENT (AUTO-SLIDE CAROUSEL)
// ==========================================
export default function TestimonialsCarousel({
  data = testimonialsData,
}: TestimonialsSectionProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section className="w-full  py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
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

        {/* Shadcn Auto-sliding Carousel */}
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="py-5">
            {data.reviews.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-4  basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Card className="h-full bg-white rounded-sm border-none shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between min-h-[220px]">
                  <CardContent className="p-0 space-y-3.5">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.maxRating }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < item.rating
                              ? "fill-[#F59E0B] text-[#F59E0B]"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review Description */}
                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-4">
                      {item.reviewText}
                    </p>
                  </CardContent>

                  {/* User Profile Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100/80 mt-4">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={item.avatarUrl}
                        alt={item.userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-[#2A2359] leading-tight truncate">
                        {item.userName}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                        {item.userCountry}
                      </p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

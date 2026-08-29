"use client";

import React from "react";
import Image from "next/image";
export interface ExperienceItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const holidayExperiencesData = {
  heading: "Holiday Experiences",
  subheading:
    "Choose a tailored getaway that perfectly aligns with your lifestyle, hobbies, and wellness goals.",
  experiences: [
    {
      id: "1",
      title: "Lakeside Escapes",
      description:
        "Wake up to breathtaking lake views and unwind in peaceful luxury surrounded by nature.",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Wellness & Spa Retreats",
      description:
        "Rejuvenate your body and mind with exclusive wellness experiences and relaxing spa escapes.",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Luxury Cabin Stays",
      description:
        "Discover beautifully designed cabins offering comfort, privacy, and unforgettable moments.",
      image:
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "4",
      title: "Family Holiday Adventures",
      description:
        "Create lasting memories with family-friendly stays, activities, and spacious holiday accommodations.",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "5",
      title: "Nature & Mountain Retreats",
      description:
        "Immerse yourself in serene landscapes and experience the beauty of Europe's most scenic destinations.",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "6",
      title: "Romantic Getaways",
      description:
        "Celebrate special moments with intimate stays designed for couples seeking a luxurious escape.",
      image:
        "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=800&auto=format&fit=crop",
    },
  ],
};

interface HolidayExperiencesProps {
  data?: typeof holidayExperiencesData;
}

export default function HolidayExperiences({
  data = holidayExperiencesData,
}: HolidayExperiencesProps ) {
  return (
    <section id="offers" className="w-full  py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
            {data.heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {data.subheading}
          </p>
        </div>

        {/* 6-Card Bento Grid (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.experiences.map((item) => (
            <div
              key={item.id}
              className="group relative h-[380px] w-full overflow-hidden rounded-sm bg-slate-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg"
            >
              {/* Background Cover Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Multi-step Vignette Gradient Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

              {/* Text Content Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 text-white space-y-1.5 pointer-events-none">
                <h3 className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-white drop-shadow-xs">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-200/90 font-normal leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

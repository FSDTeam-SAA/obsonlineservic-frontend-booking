"use client";

import React, { useEffect, useState, use } from "react";
import RetreatHeroBanner from "../../_sections/RetreatHeroBanner";
import ForestSanctuarySection from "./_components/ForestSanctuarySection";
import AvailableHolidayHomes from "./_components/AvailableHolidayHomes";
import { Reveal } from "@/components/reveal";
import HolidayExperiences from "../../_sections/HolidayExperiences";
import ResortAmenitiesSection from "./_components/ResortAmenitiesSection";
import { getHolidayParkById } from "@/features/holiday-parks/api/holiday-parks.api";
import { HolidayPark } from "@/features/holiday-parks/types";
import { HolidayParkDetailSkeleton } from "@/features/holiday-parks/components/HolidayParkSkeleton";
import { getValidImageUrl } from "@/lib/utils";

export default function HolidayParkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const parkId = resolvedParams.id;

  const [park, setPark] = useState<HolidayPark | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPark() {
      try {
        setLoading(true);
        const data = await getHolidayParkById(parkId);
        if (isMounted) {
          setPark(data);
        }
      } catch (err) {
        console.error("Failed to load holiday park details:", err);
        if (isMounted) {
          setError("Holiday park not found.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (parkId) {
      loadPark();
    }
    return () => {
      isMounted = false;
    };
  }, [parkId]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-12">
        <HolidayParkDetailSkeleton />
      </div>
    );
  }

  if (error || !park) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Holiday Park Not Found</h2>
        <p className="text-slate-500 mb-6">The requested holiday park could not be found or may have been removed.</p>
      </div>
    );
  }

  // Construct hero data from park
  const heroData = {
    rating: park.rating || 4.9,
    reviewsCount: park.reviewsCount?.toLocaleString() || "1,284",
    title: park.title || park.name,
    location: [park.location?.region, park.location?.country].filter(Boolean).join(", ") || "Europe",
    totalHomes: `${park.totalProperties || 0} Holiday Homes`,
    startingPrice: `From ${park.currency || "€"}${park.startingPrice || 129} /night`,
    primaryButtonText: "Book Your Stay",
    secondaryButtonText: "View Holiday Homes",
    backgroundImage: getValidImageUrl(park.heroBanner || park.coverImage, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920"),
  };

  // Construct sanctuary section data
  const sanctuaryData = {
    subtitle: park.subtitle || "WELCOME TO PARADISE",
    title: park.title || park.name,
    paragraphs: park.paragraphs?.length
      ? park.paragraphs
      : [
          park.fullDescription || park.shortDescription || "Veluwe Forest Retreat offers a perfect harmony of high-end architectural luxury and untouched natural beauty.",
        ],
    badge: {
      tagline: park.ecoBadge?.tagline || "CERTIFIED ECO-PARK",
      title: park.ecoBadge?.title || "100% Sustainable Stay",
    },
    image: getValidImageUrl(park.coverImage || park.heroBanner, "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200"),
  };

  return (
    <div>
      <Reveal delay={40}>
        <RetreatHeroBanner data={heroData} />
      </Reveal>
      <Reveal delay={40}>
        <ForestSanctuarySection data={sanctuaryData} />
      </Reveal>
      <Reveal delay={40}>
        <AvailableHolidayHomes parkId={parkId} />
      </Reveal>
      <Reveal delay={40}>
        <HolidayExperiences />
      </Reveal>
      <Reveal delay={40}>
        <ResortAmenitiesSection />
      </Reveal>
    </div>
  );
}
import React, { Suspense } from "react";
import { Metadata } from "next";
import SearchResultsClient from "@/features/search/components/SearchResultsClient";
import { SearchResultsSkeleton } from "@/features/search/components/SearchResultsSkeleton";

export const metadata: Metadata = {
  title: "Search Results | OBS Luxury Holiday Parks",
  description:
    "Find your ideal holiday destination. Search luxury homes, chalets, and holiday parks by location, resort, amenities, and capacity.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchResultsClient />
    </Suspense>
  );
}

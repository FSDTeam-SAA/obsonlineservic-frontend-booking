import React, { Suspense } from "react";
import ContactPage from "@/features/contact/components/ContactPage";
import { ContactPageSkeleton } from "@/features/contact/components/ContactPageSkeleton";

export const metadata = {
  title: "Contact Us | Booking is Yours - Scandinavian Luxury Holiday Escapes",
  description:
    "Get in touch with our holiday concierge team to plan your luxury Scandinavian holiday, ask questions, or request bespoke itinerary options.",
};

export default function Page() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPage />
    </Suspense>
  );
}

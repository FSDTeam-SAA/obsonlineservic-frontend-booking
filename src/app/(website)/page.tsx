import BookingProcessSection from "./_sections/BookingProcessSection";
import FeaturedDestinations from "./_sections/FeaturedDestinations";
import FeaturedHolidayParks from "./_sections/FeaturedHolidayParks";
import { Hero } from "./_sections/hero";
import HolidayExperiences from "./_sections/HolidayExperiences";
import NewsletterBanner from "./_sections/NewsletterBanner";
import PopularHolidayProperties from "./_sections/PopularHolidayProperties";
import TestimonialsCarousel from "./_sections/TestimonialsCarousel";
import WhyChooseNordicHaven from "./_sections/WhyChooseNordicHaven";
import { Reveal } from "@/components/reveal";
import { ActiveOffersSection } from "@/features/offers/components/ActiveOffersSection";
import { PlatformStatsBar } from "@/features/dashboard/components/PlatformStatsBar";

export default function HomePage() {
  return (
    <div className="booking-home bg-white">
      <Hero 
      title1={"Escape to Your Perfect"}
      title2={" Holiday Retreat"}
      description={` Discover premium holiday parks and luxury accommodations across Europe with seamless online booking.`} 
      img={"/images/HomeHero.png"}
      />
      <Reveal><FeaturedDestinations /></Reveal>
      <Reveal delay={40}><FeaturedHolidayParks /></Reveal>
      <Reveal delay={40}><PopularHolidayProperties /></Reveal>
      <Reveal delay={40}><ActiveOffersSection /></Reveal>
      <Reveal delay={40}><PlatformStatsBar /></Reveal>
      <Reveal delay={40}><WhyChooseNordicHaven /></Reveal>
      <Reveal delay={40}><HolidayExperiences /></Reveal>
      <Reveal delay={40}><BookingProcessSection /></Reveal>
      <Reveal delay={40}><TestimonialsCarousel /></Reveal>
      <Reveal delay={40}><NewsletterBanner /></Reveal>
    </div>
  );
}


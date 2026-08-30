"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Phone,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHolidayParks } from "@/features/holiday-parks/api/holiday-parks.api";
import { HolidayPark } from "@/features/holiday-parks/types";
import { submitInquiry } from "../api/contact.api";
import { InquiryPayload } from "../types/contact.types";

// Import Reusable Sections from Website
import HolidayExperiences from "@/app/(website)/_sections/HolidayExperiences";
import BookingProcessSection from "@/app/(website)/_sections/BookingProcessSection";
import NewsletterBanner from "@/app/(website)/_sections/NewsletterBanner";

export default function ContactPage() {
  const [parks, setParks] = useState<HolidayPark[]>([]);
  const [loadingParks, setLoadingParks] = useState(true);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredResort, setPreferredResort] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("2 Guests");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });

  // Fetch real holiday parks for the resort selector dropdown
  useEffect(() => {
    let isMounted = true;
    getHolidayParks({ limit: 50 })
      .then((data) => {
        if (isMounted && data?.items) {
          setParks(data.items);
        }
      })
      .catch((err) => {
        console.warn("Failed to load holiday parks list for contact form:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingParks(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    try {
      setSubmitting(true);
      setFeedback({ type: null, message: null });

      const payload: InquiryPayload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredResort,
        checkInDate,
        checkOutDate,
        guests,
        message: message.trim(),
      };

      const res = await submitInquiry(payload);

      if (res.success) {
        setFeedback({
          type: "success",
          message: res.message,
        });
        // Reset form
        setFullName("");
        setEmail("");
        setPhone("");
        setPreferredResort("");
        setCheckInDate("");
        setCheckOutDate("");
        setGuests("2 Guests");
        setMessage("");
      } else {
        setFeedback({
          type: "error",
          message: res.message || "Failed to submit inquiry. Please try again.",
        });
      }
    } catch (err: any) {
      console.error("Error submitting contact inquiry:", err);
      setFeedback({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An unexpected error occurred while sending your request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[360px] md:h-[440px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop"
          alt="Luxury Resort Holiday Escape"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
            Let's Plan Your Perfect Holiday Escape
          </h1>
          <p className="text-sm sm:text-base text-slate-200/90 font-normal leading-relaxed max-w-2xl mx-auto">
            Whether you need assistance choosing a resort, tailoring your itinerary,
            or booking, our holiday concierges are ready to help.
          </p>
        </div>
      </section>

      {/* 2. INQUIRY FORM & FEATURED SHOWCASE SECTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Form Box (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-6 space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Send an inquiry
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                  Choose a destination, select your dates, and send us your inquiry to start
                  planning your perfect getaway.
                </p>
              </div>

              {/* Status Feedback Banner */}
              {feedback.type === "success" && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Inquiry Sent Successfully</p>
                    <p className="text-emerald-700 mt-0.5">{feedback.message}</p>
                  </div>
                </div>
              )}

              {feedback.type === "error" && (
                <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Submission Error</p>
                    <p className="text-rose-700 mt-0.5">{feedback.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#30277a]/30 focus:border-[#30277a] transition-all"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#30277a]/30 focus:border-[#30277a] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +44 1234 567890"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#30277a]/30 focus:border-[#30277a] transition-all"
                    />
                  </div>

                  {/* Preferred Resort */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Preferred Resort
                    </label>
                    <select
                      value={preferredResort}
                      onChange={(e) => setPreferredResort(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#30277a]/30 focus:border-[#30277a] transition-all"
                    >
                      <option value="">Select a resort...</option>
                      {parks.map((park) => {
                        const locString = typeof park.location === "string" ? park.location : (park.location?.city || park.location?.country || "");
                        return (
                          <option key={park._id} value={park.name}>
                            {park.name} {locString ? `(${locString})` : ""}
                          </option>
                        );
                      })}
                      {parks.length === 0 && (
                        <>
                          <option value="Lakeside Haven Resort">Lakeside Haven Resort</option>
                          <option value="Alpine Mountain Lodge">Alpine Mountain Lodge</option>
                          <option value="Scandinavian Fjord Spa">Scandinavian Fjord Spa</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Check-in */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#30277a]/30 focus:border-[#30277a] transition-all"
                    />
                  </div>

                  {/* Check-out */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#30277a]/30 focus:border-[#30277a] transition-all"
                    />
                  </div>

                  {/* Guests */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#30277a]/30 focus:border-[#30277a] transition-all"
                    >
                      <option value="1 Guest">1 Guest</option>
                      <option value="2 Guests">2 Guests</option>
                      <option value="3 Guests">3 Guests</option>
                      <option value="4+ Guests">4+ Guests</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Your Message / Additional Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more about your ideal stay, preferences, special occasions..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#30277a]/30 focus:border-[#30277a] transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#30277a] hover:bg-[#231b5c] text-white text-xs sm:text-sm font-semibold h-11 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-75"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending Inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      SEND INQUIRY
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Featured Resort Showcase Card (5 cols) */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[480px] lg:min-h-full border border-slate-200/80 shadow-sm group">
            <Image
              src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop"
              alt="Featured Resort Villa"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

            {/* Top Pill Badge */}
            <div className="absolute top-5 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                <Sparkles className="size-3.5 text-amber-300" />
                Featured Resort
              </span>
            </div>

            {/* Bottom Floating Info Cards */}
            <div className="absolute bottom-5 left-5 right-5 z-10 space-y-3">
              <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-lg text-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Nordic Coastal & Glen Retreat
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active Offers
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                  Experience luxury Scandinavian cabins surrounded by fjords, nature trails, and world-class spa amenities.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-lg text-slate-800 space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="size-4 text-[#30277a]" />
                  24/7 Direct Host Service
                </h3>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  Tailored itinerary planning, private dining arrangements, and instant support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONNECT WITH OUR CONCIERGE SECTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Connect with our Concierge
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Our dedicated reservation team is available to assist you with any questions or requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Call Us */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 text-center flex flex-col items-center justify-between min-h-[220px]">
            <div className="space-y-3 flex flex-col items-center">
              <div className="size-12 rounded-2xl bg-[#EEF2F9] flex items-center justify-center text-[#30277a] shrink-0">
                <Phone className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Call Us</h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-[220px]">
                For immediate assistance & reservation planning
              </p>
            </div>
            <a
              href="tel:+441234567890"
              className="mt-4 inline-flex items-center justify-center bg-[#EEF2F9] hover:bg-[#E0E7F5] text-[#30277a] text-xs font-bold px-5 py-2.5 rounded-xl transition-colors w-full"
            >
              +44 1234 567890
            </a>
          </div>

          {/* Card 2: Working Hours */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 text-center flex flex-col items-center justify-between min-h-[220px]">
            <div className="space-y-3 flex flex-col items-center">
              <div className="size-12 rounded-2xl bg-[#EEF2F9] flex items-center justify-center text-[#30277a] shrink-0">
                <Clock className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Working Hours</h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-[220px]">
                Available 7 days a week
              </p>
            </div>
            <div className="mt-4 bg-slate-50 text-slate-700 border border-slate-200/70 text-xs font-medium px-4 py-2.5 rounded-xl w-full text-center">
              Monday - Sunday: 8:00 AM - 10:00 PM EST
            </div>
          </div>

          {/* Card 3: Email Support */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 text-center flex flex-col items-center justify-between min-h-[220px]">
            <div className="space-y-3 flex flex-col items-center">
              <div className="size-12 rounded-2xl bg-[#EEF2F9] flex items-center justify-center text-[#30277a] shrink-0">
                <Mail className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Email Support</h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-[220px]">
                For inquiries, group bookings, and feedback
              </p>
            </div>
            <a
              href="mailto:booking@example.com"
              className="mt-4 inline-flex items-center justify-center bg-[#EEF2F9] hover:bg-[#E0E7F5] text-[#30277a] text-xs font-bold px-5 py-2.5 rounded-xl transition-colors w-full"
            >
              booking@example.com
            </a>
          </div>
        </div>
      </section>

      {/* 4. REUSED HOLIDAY EXPERIENCES SECTION */}
      <HolidayExperiences />

      {/* 5. REUSED BOOKING PROCESS SECTION */}
      <BookingProcessSection />

      {/* 6. REUSED NEWSLETTER BANNER SECTION */}
      <NewsletterBanner />
    </div>
  );
}

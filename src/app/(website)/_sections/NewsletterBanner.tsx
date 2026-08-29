"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/features/newsletter/api/newsletter.api";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// Local translation dictionary mapping for future i18n extraction
const dictionary = {
  en: {
    title: "Get Exclusive Holiday Deals",
    description: "Subscribe to our newsletter to receive curated holiday itineraries, member-only discounts, and seasonal resort openings directly in your inbox.",
    placeholder: "Your email address",
    buttonText: "Subscribe",
    subscribing: "Subscribing...",
    successMessage: "Thank you! You have successfully subscribed to our newsletter.",
    errorMessage: "Unable to process subscription. Please check your email and try again.",
  }
};

const activeLang = "en"; // Default active language
const t = dictionary[activeLang];

export const newsletterData = {
  title: t.title,
  description: t.description,
  placeholder: t.placeholder,
  buttonText: t.buttonText,
  backgroundImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
};

interface NewsletterBannerProps {
  data?: typeof newsletterData;
}

export default function NewsletterBanner({
  data = newsletterData,
}: NewsletterBannerProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({
    type: null,
    message: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim();
    if (!targetEmail) return;

    try {
      setLoading(true);
      setStatus({ type: null, message: null });
      const res = await subscribeToNewsletter({ email: targetEmail });
      
      if (res.success) {
        setStatus({
          type: "success",
          message: res.message || t.successMessage,
        });
        setEmail("");
      } else {
        setStatus({
          type: "error",
          message: res.message || t.errorMessage,
        });
      }
    } catch (err: any) {
      console.error("Newsletter subscription failure:", err);
      setStatus({
        type: "error",
        message: err?.response?.data?.message || t.errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative w-full min-h-[380px] md:min-h-[420px] flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <Image
        src={data.backgroundImage}
        alt="Lake background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark Vignette & Gradient Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-brightness-75" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center text-white flex flex-col items-center">
        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
          {data.title}
        </h2>

        {/* Subtitle / Description */}
        <p className="text-xs sm:text-sm text-slate-200/90 font-normal leading-relaxed max-w-2xl mb-8">
          {data.description}
        </p>

        {/* Status Messages */}
        {status.type === "success" && (
          <div className="mb-6 max-w-xl w-full bg-emerald-500/20 border border-emerald-500/35 text-emerald-100 rounded-sm p-3 text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-sm animate-fade-in">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-450" />
            <span>{status.message}</span>
          </div>
        )}
        {status.type === "error" && (
          <div className="mb-6 max-w-xl w-full bg-rose-500/20 border border-rose-500/35 text-rose-100 rounded-sm p-3 text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-sm animate-fade-in">
            <AlertCircle className="size-4 shrink-0 text-rose-450" />
            <span>{status.message}</span>
          </div>
        )}

        {/* Newsletter Subscription Form with Glassmorphism Box */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white/20 backdrop-blur-md rounded-sm p-1.5 flex items-center border border-white/20 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-white/30"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={data.placeholder}
            required
            disabled={loading}
            className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-300 font-normal outline-none border-none disabled:opacity-50"
          />

          <Button
            type="submit"
            disabled={loading}
            className="shrink-0 bg-[#3B3388] hover:bg-[#2F296D] text-white text-xs font-semibold px-6 py-2.5 h-10 rounded-sm transition-colors shadow-none cursor-pointer flex items-center gap-2 disabled:opacity-80"
          >
            {loading && <Loader2 className="size-3.5 animate-spin" />}
            {loading ? t.subscribing : data.buttonText}
          </Button>
        </form>
      </div>
    </section>
  );
}


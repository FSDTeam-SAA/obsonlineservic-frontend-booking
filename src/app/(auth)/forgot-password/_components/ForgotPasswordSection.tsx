"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const forgotPasswordPageData = {
  title: "Forgot Password",
  subtitle: "Enter your email to reset your password",
  emailPlaceholder: "E-mail",
  submitButtonText: "Send OTP",
  coverImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
};

interface ForgotPasswordSectionProps {
  data?: typeof forgotPasswordPageData;
}

import { useRouter } from "next/navigation";
import { forgetPassword } from "@/features/auth/api/forget-password.api";

export default function ForgotPasswordSection({
  data = forgotPasswordPageData,
}: ForgotPasswordSectionProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgetPassword({ email });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send verification code. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 sm:p-6 lg:p-6 font-sans">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
        {/* Left Column: Rounded Cover Image */}
        <div className="lg:col-span-6 relative w-full h-[380px] sm:h-[500px] lg:h-[calc(100vh-3rem)] rounded-3xl overflow-hidden">
          <Image
            src={data.coverImage}
            alt="Scenic resort stay"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Right Column: Forgot Password Form */}
        <div className="lg:col-span-6 flex flex-col justify-center max-w-[440px] w-full mx-auto px-4 sm:px-0">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-[#1e1e2d] mb-3">
              {data.title}
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              {data.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-[6px] p-3 text-center">
                {error}
              </div>
            )}
            {/* Email Input */}
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={data.emailPlaceholder}
                className="w-full bg-white border border-slate-200 rounded-[6px] px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#3B3388] focus:ring-1 focus:ring-[#3B3388] transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#3B3388] hover:bg-[#2F296D] text-white font-medium text-sm rounded-[6px] transition-colors shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : data.submitButtonText}
              </Button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

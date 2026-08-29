"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// ==========================================
// 1. JSON DATA CONFIGURATION
// ==========================================
export const authPageData = {
  title: "Sign up",
  subtitle: "Please enter your email and password to continue",
  namePlaceholder: "Name",
  emailPlaceholder: "E-mail",
  newPasswordPlaceholder: "New Password",
  confirmPasswordPlaceholder: "Confirm Password",
  rememberMeLabel: "Remember me",
  submitButtonText: "Signup",
  haveAccountText: "Have an account?",
  signInText: "Sign in",
  signInLink: "/login",
  coverImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
};

interface SignUpSectionProps {
  data?: typeof authPageData;
}

// ==========================================
// 2. MAIN SIGN-UP COMPONENT
// ==========================================
import { useRouter } from "next/navigation";
import { registerUser } from "@/features/auth/api/register.api";

export default function SignUpSection({
  data = authPageData,
}: SignUpSectionProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name,
        email,
        password: newPassword,
      });
      router.push("/login?signup=success");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again."
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

        {/* Right Column: Sign Up Form */}
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

            {/* Name Input */}
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={data.namePlaceholder}
                className="w-full bg-white border border-slate-200 rounded-[6px] px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#3B3388] focus:ring-1 focus:ring-[#3B3388] transition-all"
              />
            </div>

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

            {/* New Password Input */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={data.newPasswordPlaceholder}
                className="w-full bg-white border border-slate-200 rounded-[6px] px-4 py-3.5 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#3B3388] focus:ring-1 focus:ring-[#3B3388] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showNewPassword ? (
                  <Eye className="w-[18px] h-[18px]" />
                ) : (
                  <EyeOff className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={data.confirmPasswordPlaceholder}
                className="w-full bg-white border border-slate-200 rounded-[6px] px-4 py-3.5 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#3B3388] focus:ring-1 focus:ring-[#3B3388] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showConfirmPassword ? (
                  <Eye className="w-[18px] h-[18px]" />
                ) : (
                  <EyeOff className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center text-[13px] sm:text-sm pt-1">
              <label className="flex items-center gap-2.5 text-slate-500 font-normal cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] border-slate-300 text-[#3B3388] focus:ring-[#3B3388] accent-[#3B3388]"
                />
                <span>{data.rememberMeLabel}</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#3B3388] hover:bg-[#2F296D] text-white font-medium text-sm rounded-[6px] transition-colors shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing up..." : data.submitButtonText}
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center text-sm text-slate-500 pt-3">
              <span>{data.haveAccountText} </span>
              <a
                href={data.signInLink}
                className="text-[#3B3388] hover:text-[#2F296D] font-bold underline underline-offset-2 transition-colors"
              >
                {data.signInText}
              </a>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// ==========================================
// 1. JSON DATA CONFIGURATION
// ==========================================
export const authPageData = {
  title: "Sign in",
  subtitle: "Please enter your email and password to continue",
  emailPlaceholder: "E-mail",
  passwordPlaceholder: "Password",
  rememberMeLabel: "Remember me",
  forgotPasswordText: "Forgot your password?",
  forgotPasswordLink: "/forgot-password",
  submitButtonText: "Sign in",
  noAccountText: "Haven't account?",
  signUpText: "Sign up",
  signUpLink: "/sign-up",
  coverImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
};

interface SignInSectionProps {
  data?: typeof authPageData;
}

// ==========================================
// 2. MAIN SIGN-IN COMPONENT
// ==========================================
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInSection({
  data = authPageData,
}: SignInSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";
  const errorParam = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If there's an error from next-auth redirect, map it to a user-friendly message
  const getErrorMessage = (err: string) => {
    if (err === "AccessDenied") return "Access Denied: Admins only.";
    if (err === "CredentialsSignin") return "Invalid email or password.";
    return "Authentication failed. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(getErrorMessage(res.error));
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 sm:p-6 lg:p-6 font-sans">
      <div className="w-full  grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
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

        {/* Right Column: Sign In Form */}
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
            {signupSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-[6px] p-3 text-center">
                Account created successfully! Please sign in.
              </div>
            )}

            {errorParam && !error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-[6px] p-3 text-center">
                {getErrorMessage(errorParam)}
              </div>
            )}

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

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={data.passwordPlaceholder}
                className="w-full bg-white border border-slate-200 rounded-[6px] px-4 py-3.5 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#3B3388] focus:ring-1 focus:ring-[#3B3388] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? (
                  <Eye className="w-[18px] h-[18px]" />
                ) : (
                  <EyeOff className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-[13px] sm:text-sm pt-1">
              <label className="flex items-center gap-2.5 text-slate-500 font-normal cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] border-slate-300 text-[#3B3388] focus:ring-[#3B3388] accent-[#3B3388]"
                />
                <span>{data.rememberMeLabel}</span>
              </label>

              <a
                href={data.forgotPasswordLink}
                className="text-[#3B3388] hover:text-[#2F296D] font-semibold transition-colors"
              >
                {data.forgotPasswordText}
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#3B3388] hover:bg-[#2F296D] text-white font-medium text-sm rounded-[6px] transition-colors shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : data.submitButtonText}
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-slate-500 pt-3">
              <span>{data.noAccountText} </span>
              <a
                href={data.signUpLink}
                className="text-[#3B3388] hover:text-[#2F296D] font-bold underline underline-offset-2 transition-colors"
              >
                {data.signUpText}
              </a>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
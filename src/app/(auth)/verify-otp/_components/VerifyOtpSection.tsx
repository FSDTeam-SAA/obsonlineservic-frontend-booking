"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyCode } from "@/features/auth/api/verify-code.api";
import { resetPassword } from "@/features/auth/api/reset-password.api";
import { forgetPassword } from "@/features/auth/api/forget-password.api";

export const verifyOtpPageData = {
  title: "Verify Code",
  subtitle: "Please check your email for a message with your code. Your code is 6 numbers long.",
  coverImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
};

interface VerifyOtpSectionProps {
  data?: typeof verifyOtpPageData;
}

export default function VerifyOtpSection({
  data = verifyOtpPageData,
}: VerifyOtpSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [step, setStep] = useState<"otp" | "reset">("otp");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Resend Timer State
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const startTimer = () => {
    stopTimer();
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError(null);
    setSuccessMessage(null);

    try {
      await forgetPassword({ email });
      setSuccessMessage("Verification code resent successfully.");
      startTimer();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend code. Please try again."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const otpString = otp.join("");

    if (step === "otp") {
      if (otpString.length !== 6) {
        setError("Please enter the full 6-digit code");
        setLoading(false);
        return;
      }

      try {
        await verifyCode({ email, otp: otpString });
        setStep("reset");
      } catch (err: any) {
        console.error("OTP verification error:", err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Invalid verification code. Please try again."
        );
      } finally {
        setLoading(false);
      }
    } else {
      if (!newPassword || !confirmPassword) {
        setError("Please fill out all fields");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      try {
        await resetPassword({ email, otp: otpString, newPassword });
        router.push("/login?signup=success");
      } catch (err: any) {
        console.error("Password reset error:", err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password. Please try again."
        );
      } finally {
        setLoading(false);
      }
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

        {/* Right Column: Verify OTP / Reset Form */}
        <div className="lg:col-span-6 flex flex-col justify-center max-w-[440px] w-full mx-auto px-4 sm:px-0">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-[#1e1e2d] mb-3">
              {step === "otp" ? data.title : "New Password"}
            </h1>
            <p className="text-sm text-slate-500 font-normal max-w-[320px] mx-auto">
              {step === "otp"
                ? `${data.subtitle} Sent to ${email || "your email"}`
                : "Confirm your new password to complete the reset process."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Status alerts */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-[6px] p-3 text-center">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-[6px] p-3 text-center">
                {successMessage}
              </div>
            )}

            {step === "otp" ? (
              <>
                {/* OTP Inputs */}
                <div className="flex justify-center gap-2 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      pattern="\d*"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-medium bg-white border border-slate-300 rounded-[6px] text-[#3B3388] outline-none focus:border-[#3B3388] focus:ring-1 focus:ring-[#3B3388] transition-all"
                    />
                  ))}
                </div>

                {/* Resend Text */}
                <div className="text-center text-sm">
                  {countdown > 0 ? (
                    <span className="text-slate-400 font-medium">
                      Resend code in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-[#3B3388] hover:text-[#2F296D] font-bold underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* New Password Input */}
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
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
                    placeholder="Confirm Password"
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
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#3B3388] hover:bg-[#2F296D] text-white font-medium text-sm rounded-[6px] transition-colors shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : step === "otp"
                  ? "Verify code"
                  : "Reset password"}
              </Button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

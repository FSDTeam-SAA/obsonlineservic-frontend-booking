"use client";

import React, { useState } from "react";
import { Star, X, CheckCircle2, AlertCircle, Loader2, MessageSquarePlus } from "lucide-react";
import { createReview, createUserReview } from "../api/reviews.api";
import { Review } from "../types/reviews.types";
import { useSession } from "next-auth/react";

interface WriteReviewModalProps {
  propertyId: string;
  propertyTitle: string;
  holidayParkId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReview: Review) => void;
}

export function WriteReviewModal({
  propertyId,
  propertyTitle,
  holidayParkId,
  isOpen,
  onClose,
  onSuccess,
}: WriteReviewModalProps) {
  const { data: session } = useSession();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>(session?.user?.name || "");
  const [country, setCountry] = useState<string>("Netherlands");
  const [comment, setComment] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a brief comment sharing your experience.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const dto = {
      property: propertyId,
      holidayPark: holidayParkId,
      rating,
      name: name.trim(),
      country: country.trim() || "Netherlands",
      comment: comment.trim(),
    };

    try {
      let created: Review;
      if (session?.user) {
        created = await createUserReview(dto);
      } else {
        created = await createReview(dto);
      }
      onSuccess(created);
      onClose();
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      setError(
        err?.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-all duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200 font-sans">
        {/* Header */}
        <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#3B3388]/10 flex items-center justify-center text-[#3B3388] shrink-0">
              <MessageSquarePlus className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Write a Review</h3>
              <p className="text-xs text-slate-500 truncate max-w-[280px]">
                {propertyTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3.5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Rating Selection */}
          <div className="space-y-2 text-center bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <span className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Overall Rating
            </span>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled =
                  hoverRating > 0 ? star <= hoverRating : star <= rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                    title={`${star} out of 5 stars`}
                  >
                    <Star
                      className={`size-7 transition-colors ${
                        isFilled
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="block text-xs font-bold text-[#3B3388]">
              {rating === 5 && "Excellent (5 Stars)"}
              {rating === 4 && "Very Good (4 Stars)"}
              {rating === 3 && "Average (3 Stars)"}
              {rating === 2 && "Fair (2 Stars)"}
              {rating === 1 && "Poor (1 Star)"}
            </span>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
              <span>Your Name</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="h-10 px-3.5 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-[#3B3388] text-xs text-slate-800 font-normal transition-colors"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
              <span>Country / Location</span>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Netherlands, UK, Germany"
                className="h-10 px-3.5 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-[#3B3388] text-xs text-slate-800 font-normal transition-colors"
              />
            </label>
          </div>

          {/* Review Text Area */}
          <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
            <span>Your Guest Review</span>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other travelers about your stay, amenities, surroundings, and experience..."
              className="w-full p-3.5 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-[#3B3388] text-xs text-slate-800 font-normal leading-relaxed resize-none transition-colors"
            />
          </label>

          {/* Actions */}
          <div className="flex justify-end items-center gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 border border-slate-200 bg-white text-slate-600 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-5 bg-[#3B3388] hover:bg-[#2F296D] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

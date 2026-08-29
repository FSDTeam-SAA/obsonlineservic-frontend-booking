"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { X, Calendar, Users, Tag, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { createBooking, createAuthBooking, validateOfferCode } from "../api/bookings.api";
import { Booking, CreateBookingDto } from "../types/bookings.types";

interface BookingModalProps {
  property: {
    _id: string;
    title: string;
    pricePerNight: number;
    cleaningFee?: number;
    taxes?: number;
    currency?: string;
    holidayPark?: string;
    holidayParkName?: string;
  };
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export function BookingModal({
  property,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  isOpen,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const { data: session } = useSession();

  // Form State
  const [guest, setGuest] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];
  const nextWeekStr = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [checkInDate, setCheckInDate] = useState(initialCheckIn || todayStr);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut || nextWeekStr);
  const [guestsCount, setGuestsCount] = useState(initialGuests);

  // Promo Code State
  const [offerCodeInput, setOfferCodeInput] = useState("");
  const [appliedOfferCode, setAppliedOfferCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validatingOffer, setValidatingOffer] = useState(false);
  const [offerMessage, setOfferMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate pricing breakdown
  const pricePerNight = property.pricePerNight || 129;
  const cleaningFee = property.cleaningFee ?? 80;
  const taxes = property.taxes ?? 45;
  const currency = property.currency || "€";

  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const nights = isNaN(diffTime) ? 1 : Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const subtotal = pricePerNight * nights;
  const totalAmount = Math.max(0, subtotal + cleaningFee + taxes - discountAmount);

  const handleApplyPromoCode = async () => {
    if (!offerCodeInput.trim()) return;
    setValidatingOffer(true);
    setOfferMessage(null);

    try {
      const res = await validateOfferCode({
        code: offerCodeInput.trim(),
        bookingAmount: subtotal,
        holidayParkId: property.holidayPark,
        propertyId: property._id,
      });

      setDiscountAmount(res.calculatedDiscount || 0);
      setAppliedOfferCode(res.offerCode || offerCodeInput.trim().toUpperCase());
      setOfferMessage({
        text: `Promo code applied! Saved ${currency}${res.calculatedDiscount}`,
        isError: false,
      });
    } catch (err: any) {
      setDiscountAmount(0);
      setAppliedOfferCode("");
      setOfferMessage({
        text: err?.response?.data?.message || "Invalid or expired promo code",
        isError: true,
      });
    } finally {
      setValidatingOffer(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guest.trim() || !email.trim()) {
      setError("Please provide guest name and email address.");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setLoading(true);
    setError(null);

    const dto: CreateBookingDto = {
      guest: guest.trim(),
      email: email.trim(),
      phone: phone.trim(),
      property: property._id,
      propertyName: property.title,
      holidayPark: property.holidayPark,
      park: property.holidayParkName,
      checkInDate: new Date(checkInDate).toISOString(),
      checkOutDate: new Date(checkOutDate).toISOString(),
      guestsCount,
      offerCode: appliedOfferCode || undefined,
      currency,
      specialRequests: specialRequests.trim(),
    };

    try {
      let result: Booking;
      if (session?.user) {
        result = await createAuthBooking(dto);
      } else {
        result = await createBooking(dto);
      }

      onSuccess(result);
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err?.response?.data?.message || "Failed to process booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200 font-sans max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Complete Your Reservation</h3>
            <p className="text-xs text-slate-500 mt-0.5">{property.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Guest Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                <span>Full Name *</span>
                <input
                  type="text"
                  required
                  value={guest}
                  onChange={(e) => setGuest(e.target.value)}
                  className="h-10 px-3.5 border border-slate-200 rounded-lg outline-none text-slate-800 bg-slate-50 focus:bg-white focus:border-[#3B3388] transition-colors text-xs font-normal"
                  placeholder="e.g. Clara Oswald"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                <span>Email Address *</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 px-3.5 border border-slate-200 rounded-lg outline-none text-slate-800 bg-slate-50 focus:bg-white focus:border-[#3B3388] transition-colors text-xs font-normal"
                  placeholder="clara@example.com"
                />
              </label>
            </div>

            <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
              <span>Phone Number</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 px-3.5 border border-slate-200 rounded-lg outline-none text-slate-800 bg-slate-50 focus:bg-white focus:border-[#3B3388] transition-colors text-xs font-normal"
                placeholder="+31 6 12345678"
              />
            </label>
          </div>

          <hr className="border-slate-100" />

          {/* Stay Dates & Guests */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dates & Guests</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                <span>Check-in Date</span>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="h-10 px-3 border border-slate-200 rounded-lg outline-none text-slate-800 bg-slate-50 focus:bg-white focus:border-[#3B3388] transition-colors text-xs font-normal"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                <span>Check-out Date</span>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="h-10 px-3 border border-slate-200 rounded-lg outline-none text-slate-800 bg-slate-50 focus:bg-white focus:border-[#3B3388] transition-colors text-xs font-normal"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                <span>Guests Count</span>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="h-10 px-3 border border-slate-200 rounded-lg outline-none text-slate-800 bg-slate-50 focus:bg-white focus:border-[#3B3388] transition-colors text-xs font-normal"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Promo Code Input */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Promo Code</h4>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 size-4 text-slate-400" />
                <input
                  type="text"
                  value={offerCodeInput}
                  onChange={(e) => setOfferCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER2026"
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg outline-none text-slate-800 bg-slate-50 focus:bg-white focus:border-[#3B3388] transition-colors text-xs uppercase"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromoCode}
                disabled={validatingOffer || !offerCodeInput.trim()}
                className="h-10 px-4 bg-slate-800 text-white font-semibold text-xs rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {validatingOffer && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Apply
              </button>
            </div>

            {offerMessage && (
              <p
                className={`text-xs font-medium flex items-center gap-1.5 ${
                  offerMessage.isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {!offerMessage.isError && <CheckCircle2 size={14} />}
                {offerMessage.text}
              </p>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Special Requests */}
          <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
            <span>Special Requests (Optional)</span>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              className="p-3 border border-slate-200 rounded-lg outline-none text-slate-800 bg-slate-50 focus:bg-white focus:border-[#3B3388] transition-colors text-xs font-normal resize-none"
              placeholder="Late check-in, quiet room, extra towels..."
            />
          </label>

          {/* Pricing Breakdown Card */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-600 border border-slate-200/60">
            <div className="flex justify-between">
              <span>
                {currency}{pricePerNight} x {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
              <span className="font-semibold text-slate-800">{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning Fee</span>
              <span className="font-semibold text-slate-800">{currency}{cleaningFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Local Taxes & Fees</span>
              <span className="font-semibold text-slate-800">{currency}{taxes.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount ({appliedOfferCode})</span>
                <span>-{currency}{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-slate-900 font-bold">
              <span className="text-sm">Total Due</span>
              <span className="text-base text-[#3B3388]">{currency}{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 bg-white text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-[#3B3388] text-white font-semibold rounded-lg text-xs hover:bg-[#2F296D] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Confirming Booking..." : "Confirm & Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { CheckCircle, Calendar, MapPin, Ticket, X } from "lucide-react";
import { Booking } from "../types/bookings.types";

interface BookingConfirmationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMyBookings?: () => void;
}

export function BookingConfirmationModal({
  booking,
  isOpen,
  onClose,
  onViewMyBookings,
}: BookingConfirmationModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200 font-sans">
        {/* Top Header Banner */}
        <div className="bg-[#3B3388] p-6 text-center text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Booking Confirmed!</h3>
          <p className="text-xs text-white/80 mt-1">
            Reservation Reference: <strong className="text-amber-300 font-mono">{booking.bookingId}</strong>
          </p>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PROPERTY</span>
                <h4 className="font-bold text-slate-800 text-sm mt-0.5">{booking.propertyName || "Luxury Villa"}</h4>
                {booking.park && <p className="text-slate-500 text-[11px]">{booking.park}</p>}
              </div>
            </div>

            <hr className="border-slate-200/60" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GUEST NAME</span>
                <p className="font-semibold text-slate-800 mt-0.5">{booking.guest}</p>
                <p className="text-slate-500 text-[10px] truncate">{booking.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">STAY DATES</span>
                <p className="font-semibold text-slate-800 mt-0.5">{booking.dates || `${new Date(booking.checkInDate).toLocaleDateString()} - ${new Date(booking.checkOutDate).toLocaleDateString()}`}</p>
              </div>
            </div>

            <hr className="border-slate-200/60" />

            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL PAID</span>
                <p className="font-bold text-slate-900 text-base">{booking.amount || `${booking.currency || '€'}${booking.totalAmount}`}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {booking.status}
              </span>
            </div>
          </div>

          <p className="text-slate-500 text-center text-[11px] leading-relaxed">
            A confirmation receipt has been generated for your record. You can view or manage your reservation anytime.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {onViewMyBookings && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewMyBookings();
              }}
              className="px-4 py-2 bg-[#3B3388] text-white font-semibold rounded-lg text-xs hover:bg-[#2F296D] transition-colors"
            >
              View My Bookings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

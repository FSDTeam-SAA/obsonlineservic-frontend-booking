"use client";

import React, { useEffect, useState } from "react";
import { Calendar, MapPin, AlertCircle, RefreshCw, XCircle, Clock, CheckCircle2, Ticket } from "lucide-react";
import { fetchMyBookings, cancelBooking } from "../api/bookings.api";
import { Booking, BookingStatus } from "../types/bookings.types";
import { BookingSkeleton } from "./BookingSkeleton";

export function MyBookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const loadMyBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load my bookings:", err);
      setError("Could not load your booking history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBookings();
  }, []);

  const handleCancelBooking = async (id: string, bookingCode: string) => {
    if (!confirm(`Are you sure you want to cancel booking ${bookingCode}?`)) return;

    try {
      setCancelingId(id);
      await cancelBooking(id);
      await loadMyBookings();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <BookingSkeleton />
        <BookingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center space-y-3 font-sans">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <p className="text-sm font-medium text-red-700">{error}</p>
        <button
          onClick={loadMyBookings}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3B3388] text-white text-xs font-semibold rounded-lg hover:bg-[#2F296D] transition-colors"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center space-y-3 font-sans shadow-xs">
        <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Reservations Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven't made any luxury park bookings yet. Explore our holiday homes and book your first retreat!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-lg font-bold text-slate-900">My Reservations</h2>
        <button
          onClick={loadMyBookings}
          className="text-xs text-[#3B3388] font-semibold flex items-center gap-1 hover:underline"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {bookings.map((b) => {
          const isCancelled = b.status === BookingStatus.CANCELLED || b.status === "Cancelled";
          const isConfirmed = b.status === BookingStatus.CONFIRMED || b.status === "Confirmed";

          return (
            <div
              key={b._id || b.bookingId}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BOOKING ID</span>
                  <h3 className="text-base font-bold text-slate-900">{b.bookingId}</h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    isConfirmed
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : isCancelled
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {isConfirmed && <CheckCircle2 size={13} />}
                  {isCancelled && <XCircle size={13} />}
                  {!isConfirmed && !isCancelled && <Clock size={13} />}
                  {b.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PROPERTY</span>
                  <p className="font-semibold text-slate-800 text-sm mt-0.5">
                    {b.propertyName || b.property?.title || "Holiday Home"}
                  </p>
                  {b.park && <p className="text-slate-500 text-xs">{b.park}</p>}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">STAY DATES</span>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs mt-0.5">
                    <Calendar size={14} className="text-[#3B3388]" />
                    <span>{b.dates || `${new Date(b.checkInDate).toLocaleDateString()} - ${new Date(b.checkOutDate).toLocaleDateString()}`}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AMOUNT PAID</span>
                  <p className="font-bold text-slate-900 text-base mt-0.5">
                    {b.amount || `${b.currency || '€'}${b.totalAmount}`}
                  </p>
                </div>
              </div>

              {!isCancelled && (
                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={cancelingId === (b._id || b.bookingId)}
                    onClick={() => handleCancelBooking(b._id || b.bookingId, b.bookingId)}
                    className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 font-semibold rounded-lg text-xs hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {cancelingId === (b._id || b.bookingId) ? "Canceling..." : "Cancel Reservation"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  AlertCircle,
  RefreshCw,
  XCircle,
  Clock,
  CheckCircle2,
  Ticket,
  Users,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { fetchMyBookings, cancelBooking } from "../api/bookings.api";
import { Booking, BookingStatus } from "../types/bookings.types";
import { BookingSkeleton } from "./BookingSkeleton";
import { getValidImageUrl } from "@/lib/utils";

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
    if (!confirm(`Are you sure you want to cancel reservation ${bookingCode}?`)) return;

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
      <div className="bg-red-50/80 border border-red-200 p-8 rounded-2xl text-center space-y-4 font-sans">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <div className="space-y-1">
          <p className="text-base font-bold text-red-900">Failed to Load Reservations</p>
          <p className="text-xs text-red-600 max-w-sm mx-auto">{error}</p>
        </div>
        <button
          type="button"
          onClick={loadMyBookings}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#30277a] text-white text-xs font-bold rounded-xl hover:bg-[#251e60] transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4 font-sans shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-[#30277a]">
          <Ticket className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">No Reservations Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You haven't booked any luxury holiday homes or park accommodations yet. Explore our destinations and reserve your escape!
          </p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#30277a] text-white text-xs font-bold rounded-xl hover:bg-[#251e60] transition-all shadow-xs"
        >
          <span>Explore Destinations</span>
          <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Reservations</h2>
          <p className="text-xs text-slate-500">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"} on record
          </p>
        </div>

        <button
          type="button"
          onClick={loadMyBookings}
          className="text-xs text-[#30277a] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="grid gap-5">
        {bookings.map((b) => {
          const isCancelled = b.status === BookingStatus.CANCELLED || b.status === "Cancelled";
          const isConfirmed = b.status === BookingStatus.CONFIRMED || b.status === "Confirmed";
          const isCompleted = b.status === BookingStatus.COMPLETED || b.status === "Completed";

          const propertyObj = typeof b.property === "object" ? b.property : null;
          const parkObj = typeof b.holidayPark === "object" ? b.holidayPark : null;

          const propTitle = b.propertyName || propertyObj?.title || "Luxury Holiday Home";
          const parkTitle = b.park || parkObj?.title || parkObj?.name || "Holiday Resort";
          const propertyImage = getValidImageUrl(propertyObj?.gallery?.main || propertyObj?.coverImage);
          const propertyId = propertyObj?._id || b.property;

          const datesText =
            b.dates ||
            (b.checkInDate && b.checkOutDate
              ? `${new Date(b.checkInDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })} - ${new Date(b.checkOutDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}`
              : "Dates confirmed");

          const totalPaid = b.amount || `${b.currency || "€"}${b.totalAmount || 0}`;

          return (
            <div
              key={b._id || b.bookingId}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all space-y-4 overflow-hidden"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg tracking-wide uppercase border border-slate-200">
                    {b.bookingId}
                  </span>
                  {b.createdAt && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Booked on {new Date(b.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>

                {/* Status Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                    isConfirmed || isCompleted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isCancelled
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {isConfirmed && <CheckCircle2 size={13} />}
                  {isCompleted && <ShieldCheck size={13} />}
                  {isCancelled && <XCircle size={13} />}
                  {!isConfirmed && !isCompleted && !isCancelled && <Clock size={13} />}
                  <span className="capitalize">{b.status}</span>
                </span>
              </div>

              {/* Main Card Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Image & Title */}
                <div className="md:col-span-2 flex items-center gap-3.5">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={propertyImage}
                      alt={propTitle}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                      {propTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{parkTitle}</span>
                    </div>

                    {b.offerCode && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        <Tag size={10} />
                        <span>Code: {b.offerCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stay Details */}
                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Stay Dates
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Calendar size={14} className="text-[#30277a] shrink-0" />
                    <span>{datesText}</span>
                  </div>
                  {b.guestsCount && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Users size={12} className="text-slate-400" />
                      <span>{b.guestsCount} Guests ({b.nights || 1} {b.nights === 1 ? "night" : "nights"})</span>
                    </div>
                  )}
                </div>

                {/* Total Price & Primary Action */}
                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 text-left md:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Paid
                  </span>
                  <p className="text-xl font-black text-[#30277a] tracking-tight">
                    {totalPaid}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
                {propertyId ? (
                  <Link
                    href={`/property/${propertyId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#30277a] hover:underline"
                  >
                    <span>View Property Details</span>
                    <ExternalLink size={13} />
                  </Link>
                ) : (
                  <span />
                )}

                {!isCancelled && !isCompleted && (
                  <button
                    type="button"
                    disabled={cancelingId === (b._id || b.bookingId)}
                    onClick={() => handleCancelBooking(b._id || b.bookingId, b.bookingId)}
                    className="px-4 py-2 border border-rose-200 bg-rose-50 text-rose-700 font-bold rounded-xl text-xs hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {cancelingId === (b._id || b.bookingId) ? "Canceling..." : "Cancel Reservation"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

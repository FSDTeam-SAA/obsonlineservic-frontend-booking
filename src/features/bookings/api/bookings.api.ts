import { api } from "@/lib/api";
import {
  Booking,
  CreateBookingDto,
  ValidateOfferDto,
  ValidateOfferResponse,
} from "../types/bookings.types";

/**
 * Public Guest Booking Creation
 */
export async function createBooking(dto: CreateBookingDto): Promise<Booking> {
  const response = await api.post("/bookings", dto);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

/**
 * Authenticated User Booking Creation
 */
export async function createAuthBooking(dto: CreateBookingDto): Promise<Booking> {
  const response = await api.post("/bookings/auth-booking", dto);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

/**
 * Fetch Current Logged-in User's Booking History
 */
export async function fetchMyBookings(): Promise<Booking[]> {
  const response = await api.get("/bookings/my-bookings");
  const body = response.data;
  const rawData = body?.data !== undefined ? body.data : body;

  if (Array.isArray(rawData)) {
    return rawData;
  }
  if (rawData && typeof rawData === "object" && Array.isArray(rawData.items)) {
    return rawData.items;
  }
  return [];
}

/**
 * Get Booking Details by ID or OBS Code (e.g. OBS-1024)
 */
export async function fetchBookingById(id: string): Promise<Booking> {
  const response = await api.get(`/bookings/${id}`);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

/**
 * Cancel a Booking by ID or OBS Code
 */
export async function cancelBooking(id: string): Promise<Booking> {
  const response = await api.delete(`/bookings/${id}/cancel`);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

/**
 * Validate Promo Code and Calculate Discount
 */
export async function validateOfferCode(
  dto: ValidateOfferDto
): Promise<ValidateOfferResponse> {
  const response = await api.post("/offers/validate", dto);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

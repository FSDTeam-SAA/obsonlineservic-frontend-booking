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
  return response.data;
}

/**
 * Authenticated User Booking Creation
 */
export async function createAuthBooking(dto: CreateBookingDto): Promise<Booking> {
  const response = await api.post("/bookings/auth-booking", dto);
  return response.data;
}

/**
 * Fetch Current Logged-in User's Booking History
 */
export async function fetchMyBookings(): Promise<Booking[]> {
  const response = await api.get("/bookings/my-bookings");
  return response.data;
}

/**
 * Get Booking Details by ID or OBS Code (e.g. OBS-1024)
 */
export async function fetchBookingById(id: string): Promise<Booking> {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
}

/**
 * Cancel a Booking by ID or OBS Code
 */
export async function cancelBooking(id: string): Promise<Booking> {
  const response = await api.delete(`/bookings/${id}/cancel`);
  return response.data;
}

/**
 * Validate Promo Code and Calculate Discount
 */
export async function validateOfferCode(
  dto: ValidateOfferDto
): Promise<ValidateOfferResponse> {
  const response = await api.post("/offers/validate", dto);
  return response.data;
}

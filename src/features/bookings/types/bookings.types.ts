export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  REFUNDED = 'Refunded',
}

export interface Booking {
  _id: string;
  bookingId: string;
  user?: string | null;
  guest: string;
  email: string;
  phone?: string;
  avatar?: string;
  holidayPark?: any;
  park?: string;
  property: any;
  propertyName?: string;
  checkInDate: string;
  checkOutDate: string;
  dates?: string;
  nights?: number;
  guestsCount?: number;
  pricePerNight?: number;
  cleaningFee?: number;
  taxes?: number;
  discount?: number;
  offerCode?: string;
  amount?: string;
  totalAmount?: number;
  currency?: string;
  status: BookingStatus | string;
  paymentStatus?: PaymentStatus | string;
  specialRequests?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingDto {
  guest: string;
  email: string;
  phone?: string;
  avatar?: string;
  holidayPark?: string;
  park?: string;
  property: string;
  propertyName?: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount?: number;
  offerCode?: string;
  currency?: string;
  specialRequests?: string;
}

export interface ValidateOfferDto {
  code: string;
  bookingAmount: number;
  holidayParkId?: string;
  propertyId?: string;
}

export interface ValidateOfferResponse {
  valid: boolean;
  offerCode: string;
  discountPercentage?: number;
  calculatedDiscount: number;
  message?: string;
}

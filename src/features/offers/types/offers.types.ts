export type OfferType = 'percentage' | 'fixed';

export type OfferScope = 'entire_platform' | 'holiday_parks' | 'properties';

export type OfferStatus = 'Active' | 'Expired' | 'Draft' | 'Inactive';

export type OfferPlacement = 'featured' | 'special_packages';

export interface ApplicableParkItem {
  _id: string;
  name?: string;
  title?: string;
  location?: string;
  coverImage?: string;
  startingPrice?: number;
}

export interface ApplicablePropertyItem {
  _id: string;
  title: string;
  description?: string;
  pricePerNight?: number;
  gallery?: string[];
  category?: string;
  amenities?: string[];
  location?: string;
  country?: string;
}

export interface Offer {
  _id: string;
  offerName: string;
  offerCode?: string;
  offerType: OfferType;
  discountValue: string;
  discountPercentage?: number;
  fixedDiscount?: number;
  description?: string;
  minBookingAmount?: number;
  maxDiscount?: number;
  maxUses?: number;
  maxUsesPerGuest?: number;
  usedCount?: number;
  scope: OfferScope;
  displayPlacement?: OfferPlacement;
  applicableParks?: (ApplicableParkItem | string)[];
  applicableProperties?: (ApplicablePropertyItem | string)[];
  applicableParkNames?: string[];
  validFrom: string;
  validUntil: string;
  status: OfferStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryOffersDto {
  page?: number;
  limit?: number;
  search?: string;
  offerType?: OfferType;
  scope?: OfferScope;
  displayPlacement?: OfferPlacement;
  status?: string;
}

export interface ValidateOfferDto {
  code: string;
  bookingAmount: number;
  holidayParkId?: string;
  propertyId?: string;
}

export interface ValidateOfferResponse {
  valid: boolean;
  offerId: string;
  offerName: string;
  offerCode: string;
  discountValue: string;
  calculatedDiscount: number;
  originalAmount: number;
  finalAmount: number;
}

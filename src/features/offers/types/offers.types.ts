export type OfferType = 'percentage' | 'fixed';

export type OfferScope = 'entire_platform' | 'holiday_parks' | 'properties';

export type OfferStatus = 'Active' | 'Expired' | 'Draft' | 'Inactive';

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
  applicableParks?: any[];
  applicableProperties?: any[];
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

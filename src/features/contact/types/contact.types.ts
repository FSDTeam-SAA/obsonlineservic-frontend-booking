export interface InquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  preferredResort?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: string;
  message: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface UserProfile {
  _id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
  dob?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  bio?: string;
  language?: string;
  country?: string;
  cityState?: string;
  roadArea?: string;
  postalCode?: string;
  taxId?: string;
  profileImage?: string;
  isVerified?: boolean;
  hasActiveSubscription?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  username?: string;
  dob?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  bio?: string;
  language?: string;
  country?: string;
  cityState?: string;
  roadArea?: string;
  postalCode?: string;
  taxId?: string;
}

export interface ProfileApiResponse {
  message: string;
  data: UserProfile;
}

export interface LocationDetails {
  country: string;
  city?: string;
  region?: string;
  postalCode?: string;
  formattedAddress?: string;
  mapLocationPreview?: string;
  latitude?: number;
  longitude?: number;
}

export interface CustomAmenity {
  title: string;
  description?: string;
  iconName?: string;
}

export interface EcoBadge {
  tagline?: string;
  title?: string;
}

export enum ParkStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  MAINTENANCE = 'Maintenance',
}

export interface HolidayPark {
  _id: string;
  name: string;
  title: string;
  badgeLocation?: string;
  subtitle?: string;
  shortDescription?: string;
  fullDescription?: string;
  paragraphs?: string[];
  rating?: number;
  reviewsCount?: number;
  heroBanner?: string;
  coverImage?: string;
  gallery?: string[];
  amenities?: string[];
  featuredAmenities?: CustomAmenity[];
  startingPrice?: number;
  currency?: string;
  totalProperties?: number;
  availableProperties?: number;
  totalCapacity?: string;
  checkInTime?: string;
  checkOutTime?: string;
  receptionHours?: string;
  location?: LocationDetails;
  ecoBadge?: EcoBadge;
  status: ParkStatus;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryHolidayParkParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  status?: ParkStatus;
  isFeatured?: boolean;
}

export interface PaginatedHolidayParksResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    items: HolidayPark[];
    meta: {
      totalItems: number;
      itemPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface SingleHolidayParkResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: HolidayPark;
}

export interface FeaturedHolidayParksResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: HolidayPark[];
}

export interface DestinationItem {
  id: string;
  name: string;
  badgeLocation: string;
  subLocation?: string;
  parksCount: number;
  imageUrl: string;
}


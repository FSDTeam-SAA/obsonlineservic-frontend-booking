export interface CreateReviewDto {
  name: string;
  country: string;
  rating: number; // 1 - 5
  comment: string;
  property: string; // Property ID
  holidayPark?: string; // Holiday Park ID (optional)
  avatar?: string;
}

export interface Review {
  _id: string;
  name: string;
  country: string;
  rating: number;
  comment: string;
  property: string | { _id: string; title: string };
  holidayPark?: string | { _id: string; name: string };
  avatar?: string;
  user?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedReviewsResponse {
  items: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

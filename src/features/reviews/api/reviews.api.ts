import { api } from "@/lib/api";
import { CreateReviewDto, Review, PaginatedReviewsResponse } from "../types/reviews.types";

/**
 * Submit a public guest review
 */
export async function createReview(dto: CreateReviewDto): Promise<Review> {
  const response = await api.post<Review>("/reviews", dto);
  return response.data;
}

/**
 * Submit a review tied to the logged in user
 */
export async function createUserReview(dto: CreateReviewDto): Promise<Review> {
  const response = await api.post<Review>("/reviews/user-review", dto);
  return response.data;
}

/**
 * Fetch reviews for a specific property
 */
export async function fetchPropertyReviews(propertyId: string): Promise<Review[]> {
  const response = await api.get(`/reviews?property=${propertyId}`);
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.items || response.data?.data?.items || [];
}

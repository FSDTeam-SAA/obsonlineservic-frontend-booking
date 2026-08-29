import { api } from '@/lib/api';
import {
  Offer,
  QueryOffersDto,
  ValidateOfferDto,
  ValidateOfferResponse,
} from '../types/offers.types';

export interface PaginatedOffersResponse {
  items: Offer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchActiveOffers(): Promise<Offer[]> {
  const response = await api.get<Offer[]>('/offers/active');
  return response.data;
}

export async function validateOfferCode(
  dto: ValidateOfferDto
): Promise<ValidateOfferResponse> {
  const response = await api.post<ValidateOfferResponse>('/offers/validate', dto);
  return response.data;
}

export async function fetchOffersList(
  query?: QueryOffersDto
): Promise<PaginatedOffersResponse> {
  const response = await api.get<PaginatedOffersResponse>('/offers', {
    params: query,
  });
  return response.data;
}

export async function fetchOfferById(id: string): Promise<Offer> {
  const response = await api.get<Offer>(`/offers/${id}`);
  return response.data;
}

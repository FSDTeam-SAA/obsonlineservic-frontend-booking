import { api } from "@/lib/api";
import {
  Offer,
  QueryOffersDto,
  ValidateOfferDto,
  ValidateOfferResponse,
} from "../types/offers.types";

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
  const response = await api.get("/offers/active");
  const body = response.data;
  const rawData = body?.data !== undefined ? body.data : body;

  if (Array.isArray(rawData)) {
    return rawData;
  }
  if (rawData && typeof rawData === "object" && Array.isArray(rawData.items)) {
    return rawData.items;
  }
  return [];
}

export async function validateOfferCode(
  dto: ValidateOfferDto
): Promise<ValidateOfferResponse> {
  const response = await api.post("/offers/validate", dto);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

export async function fetchOffersList(
  query?: QueryOffersDto
): Promise<PaginatedOffersResponse> {
  const response = await api.get("/offers", {
    params: query,
  });
  const body = response.data;
  const rawData = body?.data !== undefined ? body.data : body;

  if (rawData && Array.isArray(rawData.items)) {
    return rawData;
  }
  if (Array.isArray(rawData)) {
    return {
      items: rawData,
      meta: { page: 1, limit: rawData.length, total: rawData.length, totalPages: 1 },
    };
  }
  return { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } };
}

export async function fetchOfferById(id: string): Promise<Offer> {
  const response = await api.get(`/offers/${id}`);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

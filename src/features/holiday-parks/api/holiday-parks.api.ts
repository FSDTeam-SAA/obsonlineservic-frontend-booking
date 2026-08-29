import { api } from "@/lib/api";
import {
  QueryHolidayParkParams,
  PaginatedHolidayParksResponse,
  SingleHolidayParkResponse,
  FeaturedHolidayParksResponse,
  HolidayPark,
} from "../types";

export async function getHolidayParks(
  params?: QueryHolidayParkParams
): Promise<PaginatedHolidayParksResponse["data"]> {
  const response = await api.get<PaginatedHolidayParksResponse>("/holiday-parks", {
    params,
  });
  return response.data.data;
}

export async function getFeaturedHolidayParks(): Promise<HolidayPark[]> {
  const response = await api.get<FeaturedHolidayParksResponse>("/holiday-parks/featured");
  return response.data.data;
}

export async function getHolidayParkById(id: string): Promise<HolidayPark> {
  const response = await api.get<SingleHolidayParkResponse>(`/holiday-parks/${id}`);
  return response.data.data;
}

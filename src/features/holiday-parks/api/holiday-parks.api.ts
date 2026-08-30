import { api } from "@/lib/api";
import {
  QueryHolidayParkParams,
  PaginatedHolidayParksResponse,
  HolidayPark,
} from "../types";

export async function getHolidayParks(
  params?: QueryHolidayParkParams
): Promise<PaginatedHolidayParksResponse["data"]> {
  const response = await api.get<any>("/holiday-parks", {
    params,
  });

  const body = response.data;
  const rawData = body?.data !== undefined ? body.data : body;

  if (rawData && typeof rawData === "object") {
    if (Array.isArray(rawData.items)) {
      return {
        items: rawData.items,
        meta: {
          totalItems: rawData.meta?.totalItems ?? rawData.meta?.total ?? rawData.items.length,
          itemPages: rawData.meta?.itemPages ?? rawData.meta?.totalPages ?? 1,
          currentPage: rawData.meta?.currentPage ?? rawData.meta?.page ?? 1,
          itemsPerPage: rawData.meta?.itemsPerPage ?? rawData.meta?.limit ?? 10,
        },
      };
    }
    if (Array.isArray(rawData)) {
      return {
        items: rawData,
        meta: {
          totalItems: rawData.length,
          itemPages: 1,
          currentPage: 1,
          itemsPerPage: 10,
        },
      };
    }
  }

  if (Array.isArray(body)) {
    return {
      items: body,
      meta: {
        totalItems: body.length,
        itemPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      },
    };
  }

  return {
    items: [],
    meta: {
      totalItems: 0,
      itemPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
    },
  };
}

export async function getFeaturedHolidayParks(): Promise<HolidayPark[]> {
  try {
    const response = await api.get<any>("/holiday-parks/featured");
    const body = response.data;
    const items = body?.data !== undefined ? body.data : body;

    if (Array.isArray(items)) return items;
    if (items && Array.isArray(items.items)) return items.items;

    const fallback = await getHolidayParks({ limit: 6 });
    return fallback.items || [];
  } catch (err) {
    console.warn("getFeaturedHolidayParks failed, falling back to /holiday-parks query:", err);
    const fallback = await getHolidayParks({ limit: 6 });
    return fallback.items || [];
  }
}

export async function getHolidayParkById(id: string): Promise<HolidayPark> {
  const response = await api.get<any>(`/holiday-parks/${id}`);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

export async function getHolidayParkProperties(id: string, params?: Record<string, any>): Promise<any> {
  try {
    const response = await api.get(`/holiday-parks/${id}/properties`, { params });
    const body = response.data;
    return body?.data !== undefined ? body.data : body;
  } catch (err) {
    console.warn("Direct park properties API failed, falling back to /properties:", err);
    const response = await api.get("/properties", {
      params: { ...params, holidayPark: id },
    });
    const body = response.data;
    return body?.data !== undefined ? body.data : body;
  }
}

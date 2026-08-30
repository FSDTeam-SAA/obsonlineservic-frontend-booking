import { api } from '@/lib/api';
import {
  Property,
  PropertyQueryDto,
  PaginatedPropertiesResponse,
} from '../types/properties.types';

export async function fetchProperties(
  query?: PropertyQueryDto
): Promise<PaginatedPropertiesResponse> {
  const response = await api.get<any>('/properties', {
    params: query,
  });

  const body = response.data;
  const rawData = body?.data !== undefined ? body.data : body;

  if (rawData && typeof rawData === 'object') {
    if (Array.isArray(rawData.items)) {
      return {
        items: rawData.items,
        meta: {
          page: rawData.meta?.page ?? body.meta?.page ?? 1,
          limit: rawData.meta?.limit ?? body.meta?.limit ?? 10,
          total: rawData.meta?.total ?? body.meta?.total ?? rawData.items.length,
          totalPages: rawData.meta?.totalPages ?? body.meta?.totalPages ?? 1,
        },
      };
    }
    if (Array.isArray(rawData)) {
      return {
        items: rawData,
        meta: {
          page: 1,
          limit: 10,
          total: rawData.length,
          totalPages: 1,
        },
      };
    }
  }

  if (Array.isArray(body)) {
    return {
      items: body,
      meta: {
        page: 1,
        limit: 10,
        total: body.length,
        totalPages: 1,
      },
    };
  }

  return { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } };
}

export async function fetchPopularProperties(): Promise<Property[]> {
  try {
    const response = await api.get<any>('/properties/popular');
    const body = response.data;
    const items = body?.data !== undefined ? body.data : body;

    if (Array.isArray(items)) return items;
    if (items && Array.isArray(items.items)) return items.items;

    const fallback = await fetchProperties({ isPopular: true, limit: 8 });
    return fallback.items || [];
  } catch (err) {
    console.warn('fetchPopularProperties failed, using fallback /properties query:', err);
    const fallback = await fetchProperties({ limit: 8 });
    return fallback.items || [];
  }
}

export async function fetchPropertyById(id: string): Promise<Property> {
  const response = await api.get<any>(`/properties/${id}`);
  const body = response.data;
  return body?.data !== undefined ? body.data : body;
}

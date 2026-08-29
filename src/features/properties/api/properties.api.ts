import { api } from '@/lib/api';
import {
  Property,
  PropertyQueryDto,
  PaginatedPropertiesResponse,
} from '../types/properties.types';

export async function fetchProperties(
  query?: PropertyQueryDto
): Promise<PaginatedPropertiesResponse> {
  const response = await api.get<PaginatedPropertiesResponse>('/properties', {
    params: query,
  });
  return response.data;
}

export async function fetchPopularProperties(): Promise<Property[]> {
  const response = await api.get<Property[]>('/properties/popular');
  return response.data;
}

export async function fetchPropertyById(id: string): Promise<Property> {
  const response = await api.get<Property>(`/properties/${id}`);
  return response.data;
}

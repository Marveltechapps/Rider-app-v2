import { api } from './client';

export interface City {
  id: string;
  code?: string;
  name: string;
  state?: string;
  country?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchCities(params?: { search?: string; isActive?: boolean; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.isActive !== undefined) qs.set('isActive', String(params.isActive));
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const url = `/api/v1/delivery/cities${qs.toString() ? `?${qs}` : ''}`;
  const res = await api.get<
    | any[]
    | { success?: boolean; data?: any[]; pagination?: { page?: number; limit?: number; total?: number; totalPages?: number } }
  >(url);
  // api client unwraps { success, data } envelopes — res is often the cities array directly
  const rawList = Array.isArray(res)
    ? res
    : res?.success !== false && Array.isArray(res?.data)
      ? res.data
      : null;
  if (!rawList) throw new Error('Failed to load cities');
  const data = rawList.map((c: any) => ({
    id: c._id?.toString?.() ?? c.id,
    code: c.code,
    name: c.name,
    state: c.state,
    country: c.country,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
  const pagination = !Array.isArray(res) ? res?.pagination : undefined;
  return { data, pagination };
}


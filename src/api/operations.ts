/**
 * Operations API – warehouses (hubs)
 */

import { api } from './client';

export interface Warehouse {
  code: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  [key: string]: unknown;
}

export interface WarehousesResponse {
  warehouses: Warehouse[];
}

/** List warehouses (hubs) for rider to select */
export async function getWarehouses(params?: { latitude?: string; longitude?: string }): Promise<WarehousesResponse> {
  const qs = new URLSearchParams();
  if (params?.latitude) qs.set('latitude', params.latitude);
  if (params?.longitude) qs.set('longitude', params.longitude);
  const url = `/api/v1/operations/warehouses${qs.toString() ? `?${qs.toString()}` : ''}`;
  return api.get<WarehousesResponse>(url);
}

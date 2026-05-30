/**
 * Rider API – get rider, update profile
 */

import { api } from './client';

export interface PreferredLocation {
  latitude?: number;
  longitude?: number;
  addressLabel?: string;
  cityId?: string;
  cityName?: string;
  hubId?: string;
  hubName?: string;
  updatedAt?: string;
}

export interface RiderProfile {
  riderId: string;
  name: string;
  phoneNumber: string;
  email?: string;
  profilePicture?: string;
  status?: string;
  vehicle?: { type: string; registrationNumber?: string; model?: string };
  documents?: Record<string, { documentUrl?: string; number?: string; verified?: boolean }>;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    bankName?: string;
  };
  upiDetails?: { upiId?: string; accountHolderName?: string };
  preferredLocation?: PreferredLocation;
  earnings?: { totalEarned: number; pendingAmount: number; lastPayoutAt?: string };
}

export interface RiderResponse {
  rider: RiderProfile;
}

/** Get rider by ID (authenticated) */
export async function getRider(riderId: string): Promise<RiderResponse> {
  return api.get<RiderResponse>(`/api/v1/delivery/riders/${riderId}`);
}

/** Update rider profile */
export async function updateRider(riderId: string, updates: {
  name?: string;
  email?: string;
  vehicle?: { type?: string; registrationNumber?: string; model?: string };
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    bankName?: string;
  };
  upiDetails?: { upiId?: string; accountHolderName?: string };
}): Promise<RiderResponse> {
  return api.patch<RiderResponse>(`/api/v1/delivery/riders/${riderId}`, updates);
}

/** Set rider availability (online/offline). Backend: POST /api/v1/delivery/riders/:riderId/availability */
export async function setRiderAvailability(
  riderId: string,
  availability: 'available' | 'busy' | 'offline'
): Promise<RiderResponse> {
  return api.post<RiderResponse>(`/api/v1/delivery/riders/${riderId}/availability`, { availability });
}

/** Save/update rider preferred location (city, address, hub) – stored in DB */
export async function updateRiderPreferredLocation(
  riderId: string,
  data: {
    latitude: number;
    longitude: number;
    addressLabel?: string;
    cityId?: string;
    cityName?: string;
    hubId?: string;
    hubName?: string;
  }
): Promise<RiderResponse> {
  return api.put<RiderResponse>(`/api/v1/delivery/riders/${riderId}/preferred-location`, data);
}

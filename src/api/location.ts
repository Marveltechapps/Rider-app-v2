/**
 * Rider live location – POST to backend for fleet map / tracking
 */

import { api } from './client';

export async function updateRiderLocation(
  riderId: string,
  coords: { lat: number; lng: number }
): Promise<void> {
  await api.post(`/api/v1/delivery/riders/${riderId}/location`, {
    lat: coords.lat,
    lng: coords.lng,
  });
}

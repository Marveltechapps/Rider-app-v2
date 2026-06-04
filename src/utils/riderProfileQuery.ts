/**
 * Rider profile React Query helpers — consistent cache shape after GET/PATCH.
 */

import type { RiderProfile, RiderResponse } from '../api/rider';
import { asRecord } from '../api/parseResponse';

export function riderProfileQueryKey(riderId: string | undefined) {
  return ['rider', 'profile', riderId] as const;
}

/** Normalize API payloads so cache always stores `{ rider: RiderProfile }`. */
export function normalizeRiderResponse(raw: unknown): RiderResponse {
  const body = asRecord(raw);
  if (body.rider && typeof body.rider === 'object') {
    return { rider: body.rider as RiderProfile };
  }
  if (typeof body.riderId === 'string') {
    return { rider: body as RiderProfile };
  }
  return raw as RiderResponse;
}

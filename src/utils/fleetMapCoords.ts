/**
 * Coordinate helpers aligned with dashboard fleetMapApi.
 * Uses only backend order fields — no client-side coordinate generation.
 */

import type { BackendOrder } from '../api/orders';
import { isValidIndianMobile, toTenDigitMobile } from './phoneNumber';

export type LatLng = { latitude: number; longitude: number };

export function isValidCoord(lat?: number | null, lng?: number | null): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  return true;
}

export function toLatLng(c: { lat: number; lng: number }): LatLng {
  return { latitude: c.lat, longitude: c.lng };
}

/** Full delivery address string — single source for all screens. */
export function formatDeliveryAddress(order?: BackendOrder | null): string {
  const addr = order?.delivery?.address;
  if (!addr) return '';
  return [addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode]
    .filter((s) => s && s !== 'NA')
    .join(', ');
}

export function getPickupLabel(order?: BackendOrder | null): string {
  if (!order) return '';
  const code = order.darkstoreCode || order.warehouseCode;
  return code ? `Darkstore ${code}` : 'Hub';
}

/** Drop coords from order.delivery.address.coordinates or metadata.dropCoordinates only. */
export function getDropCoordinates(order?: BackendOrder | null): { lat: number; lng: number } | null {
  const c = order?.delivery?.address?.coordinates;
  if (isValidCoord(c?.lat, c?.lng)) {
    return { lat: c!.lat, lng: c!.lng };
  }
  const meta = order?.metadata as { dropCoordinates?: { lat: number; lng: number } } | undefined;
  if (isValidCoord(meta?.dropCoordinates?.lat, meta?.dropCoordinates?.lng)) {
    return meta!.dropCoordinates!;
  }
  return null;
}

/** Pickup coords from metadata.pickupCoordinates only. */
export function getPickupCoordinates(order?: BackendOrder | null): { lat: number; lng: number } | null {
  const meta = order?.metadata as { pickupCoordinates?: { lat: number; lng: number } } | undefined;
  if (isValidCoord(meta?.pickupCoordinates?.lat, meta?.pickupCoordinates?.lng)) {
    return meta!.pickupCoordinates!;
  }
  return null;
}

/** Address string to geocode when backend did not attach drop coordinates. */
export function getDropGeocodeQuery(order?: BackendOrder | null): string {
  const addr = formatDeliveryAddress(order);
  return addr && addr.length > 3 ? addr : '';
}

/** Address string to geocode when backend did not attach pickupCoordinates. */
export function getPickupGeocodeQuery(order?: BackendOrder | null): string {
  if (!order) return '';
  const meta = order.metadata as { pickupAddress?: string } | undefined;
  const code = order.darkstoreCode || order.warehouseCode;
  const label = getPickupLabel(order);
  const addr = meta?.pickupAddress?.trim();
  if (addr && addr.length > 3 && addr !== code) return addr;
  if (code) return `${label}, India`;
  return label || '';
}

export function getOrderEtaMinutes(order?: BackendOrder | null, routeMinutes?: number): number {
  if (routeMinutes != null && routeMinutes > 0) return routeMinutes;
  const eta = order?.metadata?.etaMinutes;
  return typeof eta === 'number' && eta > 0 ? eta : 15;
}

export function getOrderDistanceLabel(order?: BackendOrder | null): string {
  const km = order?.metadata?.estimatedDistanceKm;
  if (km != null && km > 0) return `~${km.toFixed(1)} km`;
  return '';
}

/** Haversine distance in metres between two lat/lng points. */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function formatRouteDistanceLabel(meters?: number | null): string {
  if (meters == null || meters <= 0) return '';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** Normalized 10-digit customer mobile for SMS/call (same rules as login OTP). */
export function getCustomerPhoneDigits(order?: BackendOrder | null): string {
  const digits = toTenDigitMobile(order?.customerPhoneNumber ?? '');
  return isValidIndianMobile(digits) ? digits : '';
}

export function formatCustomerPhone(order?: BackendOrder | null): string {
  const digits = getCustomerPhoneDigits(order);
  return digits ? `+91 ${digits}` : '';
}

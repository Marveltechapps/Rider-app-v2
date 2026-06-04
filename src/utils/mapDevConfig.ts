/**
 * Dev-only map overrides (set in Rider-app-v2/.env).
 * EXPO_PUBLIC_DARKSTORE_AT_CURRENT_LOCATION=true pins darkstore pickup to your GPS
 * when you open Travel to Darkstore (for testing arrival without going to a real hub).
 */
export function isDarkstoreAtCurrentLocationEnabled(): boolean {
  return process.env.EXPO_PUBLIC_DARKSTORE_AT_CURRENT_LOCATION === 'true';
}

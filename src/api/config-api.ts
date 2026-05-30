/**
 * App Config API – limits, support contacts, feature flags
 * Fetches from /api/v1/config; falls back to defaults when API unavailable
 */

import { getBaseUrl } from './config';

export interface AppConfig {
  /** Cash deposit limit in ₹ */
  cashLimit: number;
  /** Max deposit amount in ₹ */
  depositMaxAmount: number;
  /** Max cash withdrawals per day */
  maxWithdrawalsPerDay: number;
  /** Order list limit */
  orderListLimit: number;
  /** Payout list limit */
  payoutListLimit: number;
  /** Support phone (e.g. 1800-123-4567) */
  supportPhone: string;
  /** Support email */
  supportEmail: string;
  /** Privacy/legal email */
  privacyEmail: string;
  /** Legal contact email */
  legalEmail: string;
  /** Support SLA message (e.g. "24–48 hours") */
  supportSlaMessage: string;
  /** Default hub name when warehouse not found */
  defaultHubName: string;
  /** Vehicle types for onboarding */
  vehicleTypes: string[];
}

const DEFAULT_CONFIG: AppConfig = {
  cashLimit: 2000,
  depositMaxAmount: 2450,
  maxWithdrawalsPerDay: 2,
  orderListLimit: 100,
  payoutListLimit: 20,
  supportPhone: '1800-123-4567',
  supportEmail: 'support@selorg.com',
  privacyEmail: 'privacy@selorg.com',
  legalEmail: 'legal@selorg.com',
  supportSlaMessage: '24–48 hours',
  defaultHubName: 'Hub',
  vehicleTypes: ['Bike', 'Scooter', 'EV', 'Cycle'],
};

let cachedConfig: AppConfig | null = null;
let cacheTimestamp = 0;
const CACHE_MS = 5 * 60 * 1000; // 5 min

/** GET /api/v1/config – returns app config for rider. Uses cache. */
export async function fetchAppConfig(): Promise<AppConfig> {
  const now = Date.now();
  if (cachedConfig && now - cacheTimestamp < CACHE_MS) {
    return cachedConfig;
  }

  const base = getBaseUrl();
  if (!base) {
    return DEFAULT_CONFIG;
  }

  try {
    const res = await fetch(`${base}/api/v1/config`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data && typeof data === 'object') {
      cachedConfig = {
        ...DEFAULT_CONFIG,
        ...data,
      };
      cacheTimestamp = now;
      return cachedConfig;
    }
  } catch {
    // Network error – use defaults
  }
  return DEFAULT_CONFIG;
}

/** Clear config cache (e.g. after logout) */
export function clearConfigCache(): void {
  cachedConfig = null;
  cacheTimestamp = 0;
}

/**
 * API base URL – single source of truth: EXPO_PUBLIC_API_BASE_URL in rider_app/.env
 * (loaded into expo.extra.apiBaseUrl via app.config.js). WebSocket uses the same host.
 */

import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

/** Only env var used for backend URL — set this in rider_app/.env */
export const API_BASE_URL_ENV_KEY = 'EXPO_PUBLIC_API_BASE_URL';

/** Match selorg-dashboard-backend-v1.1 PORT in .env */
export const DEFAULT_BACKEND_PORT = 3333;
export const DEFAULT_DEV_API_BASE_URL = `http://localhost:${DEFAULT_BACKEND_PORT}`;

const LOCAL_HOST_PATTERN = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)$/i;
const PROD_API_HOST = 'api.selorg.com';
const API_BASE_URL_MESSAGE = `API base URL is not set. Add ${API_BASE_URL_ENV_KEY}=${DEFAULT_DEV_API_BASE_URL} in rider_app/.env and restart Expo with: npx expo start -c.`;

const isLocalHostname = (hostname: string): boolean => LOCAL_HOST_PATTERN.test(hostname.trim());

function isPrivateLanIpv4(host: string): boolean {
  if (!/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)) return false;
  const [a, b] = host.split('.').map((x) => Number(x));
  return a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

function isTunnelHostname(host: string): boolean {
  const h = host.trim().toLowerCase();
  return h.endsWith('.exp.direct') || h.includes('exp.host');
}

function isMdnsHostname(host: string): boolean {
  return host.trim().toLowerCase().endsWith('.local');
}

function readTunnelApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_TUNNEL_BASE_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim()) return fromEnv.trim();
  const extra = Constants.expoConfig?.extra as { apiTunnelBaseUrl?: string } | undefined;
  const fromExtra = extra?.apiTunnelBaseUrl;
  return typeof fromExtra === 'string' ? fromExtra.trim() : '';
}

function extractHostFromCandidate(candidate: unknown): string | null {
  if (typeof candidate !== 'string' || !candidate.trim()) return null;

  const trimmed = candidate.trim();
  try {
    return new URL(trimmed).hostname;
  } catch {
    const withoutScheme = trimmed.replace(/^[a-z]+:\/\//i, '');
    const hostPort = withoutScheme.split('/')[0];
    const host = hostPort.split(':')[0];
    return host || null;
  }
}

function normalizeDevHostCandidate(host: string): string | null {
  const h = host.trim();
  if (!h || isLocalHostname(h)) return null;
  if (isTunnelHostname(h)) return null;
  if (isMdnsHostname(h)) return h;
  if (isPrivateLanIpv4(h)) return h;
  return null;
}

/** Host from Expo manifest / debugger (e.g. 192.168.1.5:8082) — same approach as customer app. */
function hostFromExpoManifest(): string | null {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.manifest2?.extra?.expoClient?.hostUri,
    Constants.manifest2?.extra?.expoGo?.debuggerHost,
    // @ts-ignore - legacy manifest
    Constants.manifest?.debuggerHost,
  ];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || !candidate.trim()) continue;
    const host = candidate.trim().split(':')[0];
    const normalized = normalizeDevHostCandidate(host);
    if (normalized) return normalized;
  }
  return null;
}

function hostFromScriptUrl(): string | null {
  try {
    const scriptURL = (NativeModules as { SourceCode?: { scriptURL?: string } })?.SourceCode?.scriptURL;
    if (typeof scriptURL !== 'string' || !scriptURL.trim()) return null;
    return normalizeDevHostCandidate(new URL(scriptURL).hostname);
  } catch {
    return null;
  }
}

const getExpoDevHost = (): string | null => {
  try {
    const fromScript = hostFromScriptUrl();
    if (fromScript) return fromScript;

    const fromManifest = hostFromExpoManifest();
    if (fromManifest) return fromManifest;

    const packagerHost =
      typeof process.env.REACT_NATIVE_PACKAGER_HOSTNAME === 'string'
        ? process.env.REACT_NATIVE_PACKAGER_HOSTNAME.trim()
        : '';
    if (packagerHost) {
      const hostOnly = packagerHost.split(':')[0];
      const normalized = normalizeDevHostCandidate(hostOnly);
      if (normalized) return normalized;
    }

    const candidates = [
      Constants.expoConfig?.hostUri,
      Constants.manifest2?.extra?.expoClient?.hostUri,
      Constants.manifest2?.extra?.expoGo?.debuggerHost,
      // @ts-ignore - legacy manifest
      Constants.manifest?.debuggerHost,
    ];

    for (const candidate of candidates) {
      const host = extractHostFromCandidate(candidate);
      if (!host) continue;
      const normalized = normalizeDevHostCandidate(host);
      if (normalized) return normalized;
    }
  } catch (e) {
    console.warn('Error extracting Expo dev host:', e);
  }

  return null;
};

function shouldUseLocalBackendInDev(envUrl: string | undefined): boolean {
  if (typeof __DEV__ === 'undefined' || !__DEV__ || !envUrl) return false;
  if (process.env.EXPO_PUBLIC_USE_PRODUCTION_API === 'true') return false;
  try {
    return new URL(envUrl.trim()).hostname === PROD_API_HOST;
  } catch {
    return false;
  }
}

function resolveLocalhostForDev(): string | null {
  const lanHost = getExpoDevHost();
  if (lanHost) return lanHost;

  // 10.0.2.2 only works on the Android emulator, not on physical devices
  const isAndroidEmulator = Platform.OS === 'android' && Constants.isDevice === false;
  if (isAndroidEmulator) return '10.0.2.2';

  return null;
}

function getConfiguredFromExtra(): string {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  const value = extra?.apiBaseUrl;
  return typeof value === 'string' ? value.trim() : '';
}

const readConfiguredBaseUrl = (): string => {
  const fromEnv = process.env[API_BASE_URL_ENV_KEY];
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim();
  }
  return getConfiguredFromExtra();
};

/** Dev-only fallback when .env omits the URL; production requires .env. */
const getDevFallbackBaseUrl = (): string => DEFAULT_DEV_API_BASE_URL;

const replaceLocalhostHost = (url: URL, replacementHost: string): void => {
  if (isLocalHostname(url.hostname)) {
    url.hostname = replacementHost;
  }
};

function isTunnelPackagerContext(): boolean {
  try {
    const scriptURL = (NativeModules as { SourceCode?: { scriptURL?: string } })?.SourceCode?.scriptURL;
    if (typeof scriptURL === 'string' && scriptURL.length > 0) {
      const host = new URL(scriptURL).hostname;
      if (isTunnelHostname(host)) return true;
    }
  } catch {
    // ignore
  }
  const packager =
    typeof process.env.REACT_NATIVE_PACKAGER_HOSTNAME === 'string'
      ? process.env.REACT_NATIVE_PACKAGER_HOSTNAME.trim().split(':')[0]
      : '';
  return packager.length > 0 && isTunnelHostname(packager);
}

const normalizeDevBaseUrl = (rawUrl: string): string => {
  let trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) return '';

  if (__DEV__ && isTunnelPackagerContext()) {
    const tunnelBase = readTunnelApiBaseUrl();
    if (tunnelBase) {
      return tunnelBase.replace(/\/$/, '');
    }
    console.warn(
      '[API Config] Expo tunnel detected — set EXPO_PUBLIC_API_TUNNEL_BASE_URL in rider_app/.env ' +
        `(e.g. ngrok URL for port ${DEFAULT_BACKEND_PORT}) so the app can reach your backend on a physical device.`
    );
  }

  if (shouldUseLocalBackendInDev(trimmedUrl)) {
    if (__DEV__) {
      console.warn(
        `[API Config] Dev mode: ${PROD_API_HOST} is unreachable locally — using ${DEFAULT_DEV_API_BASE_URL}.`,
        'Set EXPO_PUBLIC_USE_PRODUCTION_API=true to call production.'
      );
    }
    trimmedUrl = DEFAULT_DEV_API_BASE_URL;
  }

  try {
    const url = new URL(trimmedUrl);
    if (!__DEV__ || !isLocalHostname(url.hostname)) {
      return trimmedUrl.replace(/\/$/, '');
    }

    const replacementHost = resolveLocalhostForDev();
    if (replacementHost) {
      replaceLocalhostHost(url, replacementHost);
    } else if (Platform.OS === 'android' && Constants.isDevice) {
      console.warn(
        '[API Config] Could not detect your computer LAN IP for the API. ' +
          'Use the same Wi‑Fi as your dev machine, run `npm start` (LAN mode), or set ' +
          `${API_BASE_URL_ENV_KEY}=http://YOUR_LAN_IP:${DEFAULT_BACKEND_PORT} in rider_app/.env`
      );
    }

    return url.toString().replace(/\/$/, '');
  } catch {
    return trimmedUrl.replace(/\/$/, '');
  }
};

let loggedResolvedBaseUrl = false;

export function getBaseUrl(): string {
  const configured = readConfiguredBaseUrl();
  const resolved = configured
    ? normalizeDevBaseUrl(configured)
    : normalizeDevBaseUrl(getDevFallbackBaseUrl());

  if (__DEV__ && !loggedResolvedBaseUrl) {
    loggedResolvedBaseUrl = true;
    console.info('[API Config] Resolved base URL:', resolved, {
      fromEnv: process.env[API_BASE_URL_ENV_KEY] ?? '(unset)',
      fromExtra: getConfiguredFromExtra() || '(unset)',
      isPhysicalDevice: Constants.isDevice,
    });
  }

  return resolved;
}

/** WebSocket shares the same backend origin as REST (path /ws). */
export function getWebSocketBaseUrl(): string {
  return getBaseUrl();
}

/** Use in API layer; throws a catchable Error with instructions when base URL is missing. */
export function getBaseUrlOrThrow(): string {
  const base = getBaseUrl();
  if (!base) {
    throw new Error(API_BASE_URL_MESSAGE);
  }
  return base;
}

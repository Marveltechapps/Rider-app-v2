/**
 * Authenticated API client – adds Bearer token, handles 401 with refresh
 */

import { getBaseUrlOrThrow } from './config';
import { asRecord, getApiErrorMessage, unwrapApiPayload } from './parseResponse';
import { getStoredAccessToken, getStoredRefreshToken, setStoredTokens, clearStoredAuth } from './storage';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function refreshAccessToken(): Promise<string | null> {
  const refresh = await getStoredRefreshToken();
  if (!refresh) return null;
  const base = getBaseUrlOrThrow();
  const res = await fetch(`${base}/api/v1/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  const raw = await res.json().catch(() => ({}));
  const data = unwrapApiPayload<{ accessToken?: string; refreshToken?: string; riderId?: string }>(raw);
  if (!res.ok || !data.accessToken) {
    await clearStoredAuth();
    return null;
  }
  await setStoredTokens(data.accessToken, data.refreshToken ?? refresh, data.riderId);
  return data.accessToken;
}

/** Make authenticated request. On 401 tries refresh once, then throws. */
export async function apiRequest<T = unknown>(
  method: ApiMethod,
  path: string,
  body?: any,
  skipAuth = false,
  options: { headers?: Record<string, string> } = {}
): Promise<T> {
  const base = getBaseUrlOrThrow();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const isFormData = body instanceof FormData;

  const doFetch = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = { ...options.headers };
    
    // Set Content-Type only if not FormData (fetch handles FormData automatically with boundary)
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) headers.Authorization = `Bearer ${token}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s global timeout

    try {
      const res = await fetch(url, {
        method,
        headers,
        signal: controller.signal,
        ...(body != null && method !== 'GET' ? { 
          body: isFormData ? body : JSON.stringify(body) 
        } : {}),
      });
      clearTimeout(timeoutId);
      return res;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  };

  let token = skipAuth ? null : await getStoredAccessToken();
  // After login, storage (e.g. SecureStore on iOS) may not be immediately readable; retry with backoff
  if (!token && !skipAuth) {
    for (const delayMs of [100, 200, 300, 500]) {
      await new Promise((r) => setTimeout(r, delayMs));
      token = await getStoredAccessToken();
      if (token) break;
    }
  }
  const hadToken = token != null;
  let res = await doFetch(token);

  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = getApiErrorMessage(asRecord(raw), res.status);
    const isAuthError = res.status === 401 || /authentication required/i.test(message);
    if (isAuthError && !skipAuth) {
      // Only clear storage when we had a token and still got 401 (expired/invalid). If we had no token
      // (e.g. storage not readable yet after OTP), do not clear so retries (e.g. HomeScreen refetch) can succeed.
      // Also, don't clear if it's within a very short window of token being present (might be backend lag)
      if (hadToken) {
        // If it's a 401, we'll try to refresh first (already done above). If we are here, refresh failed.
        // We'll clear storage, but maybe we should give it one more chance if it just happened?
        // For now, keep existing logic but add a comment.
        await clearStoredAuth();
      }
      const authError = new Error('AUTH_REQUIRED') as Error & { code?: string };
      authError.code = 'AUTH_REQUIRED';
      throw authError;
    }
    const err = new Error(message) as Error & { apiBody?: unknown; status?: number };
    err.apiBody = raw;
    err.status = res.status;
    throw err;
  }
  return unwrapApiPayload<T>(raw);
}

/** Use homeError?.message === 'AUTH_REQUIRED' to detect auth failure and redirect to login */
export const AUTH_REQUIRED_MESSAGE = 'AUTH_REQUIRED';

export const api = {
  get: <T = unknown>(path: string, options?: { headers?: Record<string, string> }) => 
    apiRequest<T>('GET', path, undefined, false, options),
  post: <T = unknown>(path: string, body?: any, options?: { headers?: Record<string, string> }) => 
    apiRequest<T>('POST', path, body, false, options),
  put: <T = unknown>(path: string, body?: any, options?: { headers?: Record<string, string> }) => 
    apiRequest<T>('PUT', path, body, false, options),
  patch: <T = unknown>(path: string, body?: any, options?: { headers?: Record<string, string> }) => 
    apiRequest<T>('PATCH', path, body, false, options),
  delete: <T = unknown>(path: string, options?: { headers?: Record<string, string> }) => 
    apiRequest<T>('DELETE', path, undefined, false, options),
};

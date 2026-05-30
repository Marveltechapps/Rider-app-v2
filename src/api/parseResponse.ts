/**
 * Parse unified backend JSON envelope:
 * { success, message, data, error, ... }
 */

import { API_BASE_URL_ENV_KEY } from './config';

export type ApiEnvelope<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string | { message?: string; code?: number };
};

export function asRecord(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return {};
}

export function getApiErrorMessage(data: Record<string, unknown>, status: number): string {
  const err = data.error;
  if (typeof err === 'string' && err.trim()) return err;
  if (err && typeof err === 'object' && err !== null && 'message' in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  if (data.success === false && typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }
  const errors = data.errors;
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    const first = Object.values(errors as Record<string, unknown>).find(
      (v) => typeof v === 'string' && v.trim()
    );
    if (typeof first === 'string') return first;
  }
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  if (status === 502) {
    return `Cannot reach the API server (502). Use ${API_BASE_URL_ENV_KEY}=http://localhost:3333 in rider_app/.env, start the backend on port 3333, then run: npx expo start -c`;
  }
  return `Request failed: ${status}`;
}

/** Unwrap envelope `data` on success; pass through legacy flat JSON. */
export function unwrapApiPayload<T>(raw: unknown): T {
  const body = asRecord(raw);
  if (body.success === true && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return (body.data ?? null) as T;
  }
  return raw as T;
}

export function isEnvelope(raw: unknown): raw is ApiEnvelope {
  const body = asRecord(raw);
  return typeof body.success === 'boolean' && Object.prototype.hasOwnProperty.call(body, 'data');
}

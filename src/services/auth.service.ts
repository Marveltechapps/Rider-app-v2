/**
 * Multi-mode login OTP service (Mobile / WhatsApp / Email) for Selorg Rider.
 * Uses /api/signin/* endpoints with preferredChannel support.
 */

import { getBaseUrlOrThrow } from '@/api/config';
import { asRecord, getApiErrorMessage, unwrapApiPayload } from '@/api/parseResponse';

export type LoginMode = 'mobile' | 'email' | 'whatsapp';
export type OtpTarget = 'phone' | 'email';
export type PreferredChannel = 'sms' | 'whatsapp' | 'email';

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  channel?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  token?: string;
  riderId?: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  loginMethod?: LoginMode;
  onboardingComplete?: boolean;
  isNewUser?: boolean;
  error?: string;
  message?: string;
}

export interface SendLoginOtpParams {
  loginMode: LoginMode;
  countryCode?: string;
  phone?: string;
  email?: string;
}

export interface VerifyLoginOtpParams {
  otpTarget: OtpTarget;
  otp: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  loginMode?: LoginMode;
}

export interface ResendLoginOtpParams {
  loginMode: LoginMode;
  countryCode?: string;
  phone?: string;
  email?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getPreferredChannel(loginMode: LoginMode): PreferredChannel {
  if (loginMode === 'whatsapp') return 'whatsapp';
  if (loginMode === 'email') return 'email';
  return 'sms';
}

export function getChannelLabel(channel?: string, loginMode?: LoginMode): string {
  const normalized = (channel ?? '').toLowerCase();
  if (normalized.includes('whatsapp')) return 'WhatsApp';
  if (normalized.includes('sms')) return 'SMS';
  if (normalized.includes('email')) return 'Email';
  if (loginMode === 'whatsapp') return 'WhatsApp';
  if (loginMode === 'email') return 'Email';
  return 'SMS';
}

export function validateEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test((email ?? '').trim());
}

/** Stricter check: full domain + TLD (e.g. .com, .in) — avoids treating partial emails as complete. */
export function isCompleteEmail(email: string): boolean {
  const trimmed = (email ?? '').trim().toLowerCase();
  if (!EMAIL_REGEX.test(trimmed)) return false;
  const tld = trimmed.split('.').pop() ?? '';
  return tld.length >= 2;
}

function normalizeIndianPhone(phone: string): string {
  const digits = (phone ?? '').toString().replace(/\D/g, '');
  if (digits.length === 10 && /^[5-9]/.test(digits)) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizeIndianPhone(phone);
  return normalized.length === 10 && /^[5-9]/.test(normalized);
}

async function postSignin<T>(
  path: string,
  body: Record<string, unknown>,
  timeoutMs = 15000
): Promise<T> {
  const base = getBaseUrlOrThrow();
  const url = `${base}/api/signin${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(getApiErrorMessage(asRecord(raw), res.status));
    }
    return unwrapApiPayload<T>(raw);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (
        err.name === 'AbortError' ||
        err.message.includes('Network request failed') ||
        err.message.includes('Failed to fetch')
      ) {
        throw new Error('Unable to reach the server. Please try again in a moment.');
      }
      throw err;
    }
    throw err;
  }
}

function normalizeSendResponse(data: Record<string, unknown>, fallbackChannel?: string): SendOtpResponse {
  if (data.success === false) {
    const errMsg =
      typeof data.error === 'string'
        ? data.error
        : typeof data.message === 'string'
          ? data.message
          : 'Failed to send OTP';
    return { success: false, error: errMsg };
  }
  const channel =
    typeof data.channel === 'string'
      ? data.channel
      : fallbackChannel;
  const message =
    typeof data.message === 'string' ? data.message : 'OTP sent successfully';
  return {
    success: true,
    message,
    channel,
  };
}

export async function sendLoginOtp(params: SendLoginOtpParams): Promise<SendOtpResponse> {
  if (params.loginMode === 'email') {
    const email = (params.email ?? '').trim().toLowerCase();
    if (!email) return { success: false, error: 'Enter email address' };
    if (!validateEmailFormat(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    try {
      const data = await postSignin<Record<string, unknown>>(
        '/send-otp',
        { email, preferredChannel: 'email' },
        60000
      );
      return normalizeSendResponse(data ?? {}, 'email');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP';
      if (/phone number is required/i.test(msg)) {
        return {
          success: false,
          error: 'Email login is not available on this server. Use Mobile/WhatsApp or update the API.',
        };
      }
      return { success: false, error: msg };
    }
  }

  const nationalDigits = (params.phone ?? '').replace(/\D/g, '');
  if (!nationalDigits) {
    return {
      success: false,
      error: params.loginMode === 'whatsapp' ? 'Enter WhatsApp number' : 'Enter mobile number',
    };
  }

  const dial = params.countryCode ?? '+91';
  if (dial !== '+91') {
    return {
      success: false,
      error: 'Only Indian mobile numbers (+91) are supported at this time.',
    };
  }

  if (!isValidIndianPhone(nationalDigits)) {
    return { success: false, error: 'Invalid number format' };
  }

  const preferredChannel = getPreferredChannel(params.loginMode);
  try {
    const data = await postSignin<Record<string, unknown>>(
      '/send-otp',
      {
        mobileNumber: normalizeIndianPhone(nationalDigits),
        preferredChannel,
      },
      preferredChannel === 'whatsapp' ? 45000 : 30000
    );
    return normalizeSendResponse(data ?? {}, preferredChannel);
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to send OTP' };
  }
}

export async function resendLoginOtp(params: ResendLoginOtpParams): Promise<SendOtpResponse> {
  if (params.loginMode === 'email') {
    const email = (params.email ?? '').trim().toLowerCase();
    if (!email || !validateEmailFormat(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    try {
      const data = await postSignin<Record<string, unknown>>(
        '/resend-otp',
        { email, preferredChannel: 'email' },
        60000
      );
      return normalizeSendResponse(data ?? {}, 'email');
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to resend OTP' };
    }
  }

  const mobile = normalizeIndianPhone(params.phone ?? '');
  if (!mobile || !isValidIndianPhone(mobile)) {
    return { success: false, error: 'Phone number is missing or invalid.' };
  }

  const preferredChannel = getPreferredChannel(params.loginMode);
  try {
    const data = await postSignin<Record<string, unknown>>(
      '/resend-otp',
      {
        mobileNumber: mobile,
        preferredChannel,
      },
      preferredChannel === 'whatsapp' ? 45000 : 30000
    );
    return normalizeSendResponse(data ?? {}, preferredChannel);
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to resend OTP' };
  }
}

export async function verifyLoginOtp(params: VerifyLoginOtpParams): Promise<VerifyOtpResponse> {
  const otp = (params.otp ?? '').trim();
  if (!/^\d{4}$/.test(otp)) {
    return { success: false, error: 'OTP must be 4 digits.' };
  }

  if (params.otpTarget === 'email') {
    const email = (params.email ?? '').trim().toLowerCase();
    if (!email || !validateEmailFormat(email)) {
      return { success: false, error: 'Email address is missing or invalid.' };
    }
    try {
      const data = await postSignin<{
        message?: string;
        token?: string;
        riderId?: string;
        name?: string | null;
        phoneNumber?: string | null;
        email?: string | null;
        loginMethod?: LoginMode;
        onboardingComplete?: boolean;
        isNewUser?: boolean;
      }>('/verify-otp', { email, otp });
      if (!data.token) {
        return { success: false, error: 'Invalid or expired OTP. Please try again.' };
      }
      return {
        success: true,
        token: data.token,
        riderId: data.riderId,
        name: data.name ?? undefined,
        email: data.email ?? email,
        phoneNumber: data.phoneNumber ?? undefined,
        loginMethod: data.loginMethod ?? 'email',
        onboardingComplete: !!data.onboardingComplete,
        isNewUser: data.isNewUser,
        message: data.message,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Invalid or expired OTP. Please try again.',
      };
    }
  }

  const mobile = normalizeIndianPhone(params.phone ?? '');
  if (!mobile || !isValidIndianPhone(mobile)) {
    return { success: false, error: 'Phone number is missing or invalid.' };
  }

  const preferredChannel = params.loginMode ? getPreferredChannel(params.loginMode) : 'sms';
  try {
    const data = await postSignin<{
      message?: string;
      token?: string;
      riderId?: string;
      name?: string | null;
      phoneNumber?: string;
      email?: string | null;
      loginMethod?: LoginMode;
      onboardingComplete?: boolean;
      isNewUser?: boolean;
    }>('/verify-otp', {
      mobileNumber: mobile,
      otp,
      preferredChannel,
      deviceId: 'mobile-app',
      deviceName: 'Mobile App',
    });
    if (!data.token) {
      return { success: false, error: 'Invalid or expired OTP. Please try again.' };
    }
    return {
      success: true,
      token: data.token,
      riderId: data.riderId,
      name: data.name ?? undefined,
      phoneNumber: data.phoneNumber ?? `+91 ${mobile}`,
      email: data.email ?? undefined,
      loginMethod: data.loginMethod ?? (preferredChannel === 'whatsapp' ? 'whatsapp' : 'mobile'),
      onboardingComplete: !!data.onboardingComplete,
      isNewUser: data.isNewUser,
      message: data.message,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Invalid or expired OTP. Please try again.',
    };
  }
}

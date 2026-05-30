/**
 * Auth API – send OTP, verify OTP
 */

import { API_BASE_URL_ENV_KEY, getBaseUrlOrThrow } from './config';
import { asRecord, getApiErrorMessage, unwrapApiPayload } from './parseResponse';

/** Normalize phone for display: digits only, optional leading + */
export const normalizePhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('91') && digits.length === 12 ? `+${digits}` : digits.length === 10 ? `+91${digits}` : `+${digits}`;
};

/** Get 10-digit mobile for signin API (same as Postman: real-time SMS) */
function toSigninMobile(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.slice(-10);
}

export interface RequestOtpResponse {
  success?: boolean;
  message: string;
  sessionId?: string;
  expiresAt?: string;
}

export interface VerifyOtpResponse {
  success?: boolean;
  message: string;
  tokens?: { accessToken: string; refreshToken: string; expiresIn: number };
  riderId?: string;
  phoneNumber?: string;
  name?: string;
  status?: string;
  sessionId?: string;
  mfaRequired?: boolean;
  /** True when user has name and all required KYC docs verified → go to dashboard */
  onboardingComplete?: boolean;
}

/** Existing user login – if user has completed onboarding, returns token so app can skip OTP and go to dashboard */
export interface ExistingUserLoginResponse {
  canSkipOtp: boolean;
  token?: string;
  riderId?: string;
  name?: string | null;
  phoneNumber?: string;
  onboardingComplete?: boolean;
}

export async function existingUserLogin(phoneNumber: string): Promise<ExistingUserLoginResponse> {
  const base = getBaseUrlOrThrow();
  const mobile = toSigninMobile(phoneNumber);
  if (mobile.length !== 10) {
    return { canSkipOtp: false };
  }
  const url = `${base}/api/signin/existing-user-login`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: mobile }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) return { canSkipOtp: false };
    const data = unwrapApiPayload<ExistingUserLoginResponse>(raw);
    return {
      canSkipOtp: !!data.canSkipOtp,
      token: data.token,
      riderId: data.riderId,
      name: data.name,
      phoneNumber: data.phoneNumber,
      onboardingComplete: !!data.onboardingComplete,
    };
  } catch {
    clearTimeout(timeoutId);
    return { canSkipOtp: false };
  }
}

/** Request OTP – uses /api/signin/send-otp so OTP is sent in real time via SMS (same as Postman) */
export async function requestOtp(phoneNumber: string): Promise<RequestOtpResponse> {
  const base = getBaseUrlOrThrow();
  const mobile = toSigninMobile(phoneNumber);
  if (mobile.length !== 10) {
    throw new Error('Phone number must be 10 digits (or 12 with 91).');
  }
  const url = `${base}/api/signin/send-otp`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: mobile }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(getApiErrorMessage(asRecord(raw), res.status));
    }
    const data = unwrapApiPayload<{ message?: string }>(raw);
    return { success: true, message: data.message ?? 'OTP sent successfully' };
    } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      const message = err.message || '';

      // Preserve explicit config errors so they can be surfaced in developer tooling/toasts if needed
      if (
        message.includes('API base URL') ||
        message.includes(API_BASE_URL_ENV_KEY) ||
        message.includes('is not set')
      ) {
        throw err;
      }

      // Hide low-level network/timeout details from the UI – just log them and show a generic message
      if (err.name === 'AbortError' || message.includes('Network request failed') || message.includes('Failed to fetch')) {
        console.warn('[requestOtp] Network or timeout error while sending OTP:', err);
        throw new Error('Unable to send OTP right now. Please try again in a moment.');
      }

      // Other backend errors (e.g. validation) still surface their message
      throw err;
    }
    throw err;
  }
}

/** Verify OTP – uses /api/signin/verify-otp (4-digit OTP, returns token and user info) */
export async function verifyOtp(
  phoneNumber: string,
  code: string,
  _userType: 'rider' = 'rider'
): Promise<VerifyOtpResponse> {
  const base = getBaseUrlOrThrow();
  const mobile = toSigninMobile(phoneNumber);
  if (mobile.length !== 10) {
    throw new Error('Phone number must be 10 digits.');
  }
  const url = `${base}/api/signin/verify-otp`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        mobileNumber: mobile, 
        otp: code.trim(),
        deviceId: 'mobile-app', // Added for session creation
        deviceName: 'Mobile App'
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(getApiErrorMessage(asRecord(raw), res.status));
    }
    const data = unwrapApiPayload<{
      message?: string;
      token?: string;
      riderId?: string;
      name?: string;
      phoneNumber?: string;
      onboardingComplete?: boolean;
    }>(raw);
    const token = data.token;
    const riderId = data.riderId;
    const name = data.name ?? '';
    const phone = data.phoneNumber ?? normalizePhoneNumber(mobile);
    const onboardingComplete = !!data.onboardingComplete;
    return {
      success: true,
      message: data.message ?? 'OTP verified successfully',
      tokens: token
        ? { accessToken: token, refreshToken: token, expiresIn: 28 * 24 * 60 * 60 }
        : undefined,
      riderId: riderId,
      phoneNumber: phone,
      name: name ?? undefined,
      onboardingComplete,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError' || err.message.includes('Network request failed') || err.message.includes('Failed to fetch')) {
        console.warn('[verifyOtp] Network or timeout error while verifying OTP:', err);
        throw new Error('Unable to verify OTP right now. Please try again.');
      }
      throw err;
    }
    throw err as any;
  }
}

/** Get current user profile (requires auth) */
export interface MeProfile {
  profile: {
    id: string;
    phoneNumber: string;
    name: string;
    email?: string;
    status?: string;
    onboardingComplete?: boolean;
    preferredLocation?: {
      latitude: number;
      longitude: number;
      addressLabel?: string;
      cityId?: string;
      cityName?: string;
      hubId?: string;
      hubName?: string;
    };
    vehicle?: { type: string; registrationNumber?: string; model?: string };
    profilePicture?: string;
  };
}

export async function getMe(): Promise<MeProfile> {
  const { api } = await import('./client');
  return api.get<MeProfile>('/api/v1/auth/me');
}

/** Get current onboarding state (requires auth) */
export interface OnboardingStateResponse {
  success: boolean;
  riderId: string;
  onboardingComplete: boolean;
  currentStep: 'profile' | 'location' | 'vehicle' | 'profile-photo' | 'documents' | 'training' | 'kit' | 'complete';
  trainingCompleted: boolean;
  kitComplete?: boolean;
  checkedKitItems?: string[];
  checkedKitItemLabels?: string[];
}

export async function getOnboardingState(): Promise<OnboardingStateResponse> {
  const { api } = await import('./client');
  return api.get<OnboardingStateResponse>('/api/v1/auth/onboarding/state');
}

/** Complete training (requires auth) */
export interface CompleteTrainingResponse {
  success: boolean;
  trainingCompleted: boolean;
}

export async function completeTraining(): Promise<CompleteTrainingResponse> {
  const { api } = await import('./client');
  return api.post<CompleteTrainingResponse>('/api/v1/auth/onboarding/complete-training');
}

/** Update kit status (requires auth) */
export interface UpdateKitStatusResponse {
  success: boolean;
  checkedKitItems: string[];
  checkedKitItemLabels?: string[];
}

export async function updateKitStatus(checkedItemIds: string[]): Promise<UpdateKitStatusResponse> {
  const { api } = await import('./client');
  return api.post<UpdateKitStatusResponse>('/api/v1/auth/onboarding/kit-status', { checkedItemIds });
}

/** Upload profile photo (requires auth) */
export interface UploadProfilePhotoResponse {
  success: boolean;
  profilePicture: string;
}

export async function uploadProfilePhoto(uri: string): Promise<UploadProfilePhotoResponse> {
  const { api } = await import('./client');
  
  const formData = new FormData();
  const filename = uri.split('/').pop() || 'profile.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;
  
  formData.append('file', {
    uri,
    name: filename,
    type,
  } as any);

  return api.post<UploadProfilePhotoResponse>('/api/v1/auth/profile-photo', formData);
}

/** Self-service account deletion (requires auth). Backend soft-deletes and anonymizes PII. */
export async function deleteAccount(): Promise<{ success: boolean; message?: string }> {
  const { api } = await import('./client');
  return api.post<{ success: boolean; message?: string }>('/api/v1/auth/delete-account', {
    confirm: true,
  });
}

/** Logout – call backend and clear local tokens */
export async function logout(): Promise<void> {
  const { api } = await import('./client');
  const { clearStoredAuth } = await import('./storage');
  try {
    await api.post('/api/v1/auth/logout');
  } catch (err) {
    if (__DEV__) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[auth.logout] Backend logout failed, clearing local auth only:', message);
    }
  } finally {
    await clearStoredAuth();
  }
}

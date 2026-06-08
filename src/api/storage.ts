/**
 * Secure token storage for auth (access + refresh).
 * Uses SecureStore on native; localStorage on web (expo-secure-store is not implemented for web).
 */

import { Platform } from 'react-native';

const KEY_ACCESS = 'rider_access_token';
const KEY_REFRESH = 'rider_refresh_token';
const KEY_RIDER_ID = 'rider_id';
const KEY_ONBOARD_STEP = 'onboarding_step';
const KEY_ONBOARDING_COMPLETE = 'onboarding_complete';
const KEY_LOGIN_METHOD = 'login_method';
const KEY_LOGIN_CONTACT = 'login_contact';

const PREFIX = 'rider_auth_';

function isWeb(): boolean {
  return Platform.OS === 'web';
}

// --- Web: localStorage (expo-secure-store has no native impl on web) ---
function webGet(key: string): Promise<string | null> {
  if (typeof localStorage === 'undefined') return Promise.resolve(null);
  try {
    return Promise.resolve(localStorage.getItem(PREFIX + key));
  } catch {
    return Promise.resolve(null);
  }
}

function webSet(key: string, value: string): Promise<void> {
  if (typeof localStorage === 'undefined') return Promise.resolve();
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {}
  return Promise.resolve();
}

function webDelete(key: string): Promise<void> {
  if (typeof localStorage === 'undefined') return Promise.resolve();
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
  return Promise.resolve();
}

// --- Native: SecureStore ---
async function nativeGet(key: string): Promise<string | null> {
  const SecureStore = await import('expo-secure-store');
  return SecureStore.getItemAsync(key);
}

async function nativeSet(key: string, value: string): Promise<void> {
  const SecureStore = await import('expo-secure-store');
  await SecureStore.setItemAsync(key, value);
}

async function nativeDelete(key: string): Promise<void> {
  const SecureStore = await import('expo-secure-store');
  await SecureStore.deleteItemAsync(key);
}

// --- Public API (same keys as before for native) ---
const K = { access: KEY_ACCESS, refresh: KEY_REFRESH, riderId: KEY_RIDER_ID };

export async function getStoredAccessToken(): Promise<string | null> {
  return isWeb() ? webGet(K.access) : nativeGet(K.access);
}

export async function getStoredRefreshToken(): Promise<string | null> {
  return isWeb() ? webGet(K.refresh) : nativeGet(K.refresh);
}

export async function getStoredRiderId(): Promise<string | null> {
  return isWeb() ? webGet(K.riderId) : nativeGet(K.riderId);
}

export async function setStoredTokens(access: string, refresh: string, riderId?: string): Promise<void> {
  if (isWeb()) {
    await webSet(K.access, access);
    await webSet(K.refresh, refresh);
    if (riderId != null) await webSet(K.riderId, riderId);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  const tasks: Promise<void>[] = [
    SecureStore.setItemAsync(K.access, access),
    SecureStore.setItemAsync(K.refresh, refresh),
  ];
  if (riderId != null) tasks.push(SecureStore.setItemAsync(K.riderId, riderId));
  await Promise.all(tasks);
}

export async function clearStoredAuth(): Promise<void> {
  if (isWeb()) {
    await webDelete(K.access);
    await webDelete(K.refresh);
    await webDelete(K.riderId);
    await webDelete(KEY_ONBOARDING_COMPLETE);
    await webDelete(KEY_LOGIN_METHOD);
    await webDelete(KEY_LOGIN_CONTACT);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  await Promise.all([
    SecureStore.deleteItemAsync(K.access),
    SecureStore.deleteItemAsync(K.refresh),
    SecureStore.deleteItemAsync(K.riderId),
    SecureStore.deleteItemAsync(KEY_ONBOARDING_COMPLETE),
    SecureStore.deleteItemAsync(KEY_LOGIN_METHOD),
    SecureStore.deleteItemAsync(KEY_LOGIN_CONTACT),
  ]);
}

export async function setStoredOnboardingStep(step: string | null): Promise<void> {
  if (isWeb()) {
    if (step === null) {
      await webDelete(KEY_ONBOARD_STEP);
      return;
    }
    await webSet(KEY_ONBOARD_STEP, step);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  if (step === null) {
    await SecureStore.deleteItemAsync(KEY_ONBOARD_STEP);
    return;
  }
  await SecureStore.setItemAsync(KEY_ONBOARD_STEP, step);
}

export async function getStoredOnboardingStep(): Promise<string | null> {
  if (isWeb()) {
    return webGet(KEY_ONBOARD_STEP);
  }
  const SecureStore = await import('expo-secure-store');
  return SecureStore.getItemAsync(KEY_ONBOARD_STEP);
}

export async function clearStoredOnboardingStep(): Promise<void> {
  return setStoredOnboardingStep(null);
}

export async function setStoredOnboardingComplete(complete: boolean): Promise<void> {
  const value = complete ? 'true' : 'false';
  if (isWeb()) {
    await webSet(KEY_ONBOARDING_COMPLETE, value);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  await SecureStore.setItemAsync(KEY_ONBOARDING_COMPLETE, value);
}

export async function getStoredOnboardingComplete(): Promise<boolean> {
  const raw = isWeb()
    ? await webGet(KEY_ONBOARDING_COMPLETE)
    : await (async () => {
        const SecureStore = await import('expo-secure-store');
        return SecureStore.getItemAsync(KEY_ONBOARDING_COMPLETE);
      })();
  return raw === 'true';
}

export async function clearStoredOnboardingComplete(): Promise<void> {
  if (isWeb()) {
    await webDelete(KEY_ONBOARDING_COMPLETE);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  await SecureStore.deleteItemAsync(KEY_ONBOARDING_COMPLETE);
}

export async function setStoredLoginSession(
  loginMethod: string,
  loginContact: string
): Promise<void> {
  if (isWeb()) {
    await webSet(KEY_LOGIN_METHOD, loginMethod);
    await webSet(KEY_LOGIN_CONTACT, loginContact);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  await Promise.all([
    SecureStore.setItemAsync(KEY_LOGIN_METHOD, loginMethod),
    SecureStore.setItemAsync(KEY_LOGIN_CONTACT, loginContact),
  ]);
}

export async function getStoredLoginMethod(): Promise<string | null> {
  return isWeb() ? webGet(KEY_LOGIN_METHOD) : nativeGet(KEY_LOGIN_METHOD);
}

export async function getStoredLoginContact(): Promise<string | null> {
  return isWeb() ? webGet(KEY_LOGIN_CONTACT) : nativeGet(KEY_LOGIN_CONTACT);
}

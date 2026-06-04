import type { Href } from 'expo-router';

/** Subset of `useRouter()` used by safe-back helpers (avoids tight coupling to expo-router types). */
export type ExpoRouterLike = {
  dismissTo(href: Href): void;
};

/**
 * Pops until `fallback` is focused, or replaces the current screen with `fallback` if that route
 * is not in the stack. Uses Expo Router `dismissTo` so back works after `replace()`-heavy onboarding
 * and when `canGoBack()` is true but `back()` does not pop the visible screen.
 */
export function goBackOrReplace(router: ExpoRouterLike, fallback: Href): void {
  router.dismissTo(fallback);
}

const PERSONAL_DETAILS_FALLBACKS = new Set<string>(['/profile-photo', '/vehicle-details']);

/** When `returnTo` is passed (e.g. from a future entry point), honor it if allowlisted. */
export function resolvePersonalDetailsFallback(returnTo: string | undefined): Href {
  if (returnTo && PERSONAL_DETAILS_FALLBACKS.has(returnTo)) {
    return returnTo as Href;
  }
  return '/profile-photo';
}

const UPLOAD_RETURN_PATHS = new Set<string>(['/kyc-upload', '/my-documents']);

export function resolveUploadBackFallback(returnTo: string | string[] | undefined): Href {
  const raw = Array.isArray(returnTo) ? returnTo[0] : returnTo;
  if (typeof raw === 'string' && UPLOAD_RETURN_PATHS.has(raw)) {
    return raw as Href;
  }
  return '/kyc-upload';
}

const LEGAL_RETURN_PATHS = new Set<string>(['/login', '/(tabs)/profile']);

/** After saving payment details, return to Bank Details without stacking duplicate screens. */
export function goToPaymentDetails(router: ExpoRouterLike): void {
  goBackOrReplace(router, '/payment-details');
}

/** Back target for terms / privacy screens opened from login or profile. */
export function resolveLegalBackFallback(
  returnTo: string | string[] | undefined,
  isLoggedIn?: boolean
): Href {
  const raw = Array.isArray(returnTo) ? returnTo[0] : returnTo;
  if (typeof raw === 'string' && LEGAL_RETURN_PATHS.has(raw)) {
    return raw as Href;
  }
  return isLoggedIn ? '/(tabs)/profile' : '/login';
}

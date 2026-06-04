/**
 * Immediate navigation helpers — first tap runs synchronously (no InteractionManager delay).
 */

import type { Router } from 'expo-router';

/** Run back navigation on the same tick as the press handler. */
export function runBackNavigation(router: Router, onBack?: () => void): void {
  if (onBack) {
    onBack();
    return;
  }
  if (router.canGoBack()) {
    router.back();
  }
}

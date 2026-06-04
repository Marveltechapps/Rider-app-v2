/**
 * Debug logging for cold-start routing decisions.
 * Logs never include raw token values — only presence/absence.
 */

export type StartupRedirectReason =
  | 'no_token'
  | 'session_expired'
  | 'onboarding_complete_go_home'
  | 'onboarding_incomplete_resume_step'
  | 'onboarding_incomplete_start'
  | 'not_logged_in'
  | 'blocked_onboarding_while_complete'
  | 'backend_hydrated'
  | 'using_cached_session';

export function logStartupNav(
  event: string,
  details: Record<string, string | boolean | number | null | undefined>
): void {
  if (__DEV__) {
    console.log(`[StartupNav] ${event}`, details);
  }
}

export function tokenPresenceLabel(token: string | null | undefined): string {
  return token ? 'present' : 'missing';
}

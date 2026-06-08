import type { LoginMode } from '@/services/auth.service';

/** Placeholder phone generated for email-only riders on the backend. */
export function isSyntheticRiderPhone(phone?: string | null): boolean {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return digits.length === 10 && digits.startsWith('1');
}

export function formatLoginPhone(countryCode: string, phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  const dial = countryCode.trim() || '+91';
  return `${dial} ${digits}`;
}

export function resolveLoginContact(
  loginMode: LoginMode,
  params: { email?: string; countryCode?: string; phone?: string }
): string {
  if (loginMode === 'email') return (params.email ?? '').trim().toLowerCase();
  return formatLoginPhone(params.countryCode ?? '+91', params.phone ?? '');
}

export function profilePhoneDisplay(
  loginMode: LoginMode | null | undefined,
  phone?: string | null
): string {
  const raw = String(phone ?? '').trim();
  if (!raw || raw === '—') return '—';
  if (loginMode === 'email' && isSyntheticRiderPhone(raw)) return '—';
  return raw;
}

export function profileEmailDisplay(
  loginMode: LoginMode | null | undefined,
  email?: string | null
): string {
  const raw = String(email ?? '').trim();
  if (!raw || raw === '—') return '—';
  return raw;
}

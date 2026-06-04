/**
 * Best-effort display name from IFSC bank code — prefers backend config API.
 */
import { getBaseUrlOrThrow } from '../api/config';

const IFSC_BANK_PREFIX: Record<string, string> = {
  HDFC: 'HDFC Bank',
  SBIN: 'State Bank of India',
  ICIC: 'ICICI Bank',
  UTIB: 'Axis Bank',
  KKBK: 'Kotak Mahindra Bank',
  YESB: 'Yes Bank',
  PUNB: 'Punjab National Bank',
  BARB: 'Bank of Baroda',
  CNRB: 'Canara Bank',
  IDIB: 'Indian Bank',
  UBIN: 'Union Bank of India',
};

export function guessBankNameFromIfsc(ifsc: string): string {
  const code = (ifsc || '').trim().toUpperCase().slice(0, 4);
  return IFSC_BANK_PREFIX[code] ?? '';
}

/** Fetch bank name from backend IFSC lookup (falls back to local map). */
export async function fetchBankNameFromIfsc(ifsc: string): Promise<string> {
  const trimmed = (ifsc || '').trim().toUpperCase();
  if (trimmed.length < 4) return '';
  const local = guessBankNameFromIfsc(trimmed);
  if (local) return local;
  try {
    const base = getBaseUrlOrThrow();
    const res = await fetch(`${base}/api/v1/config/ifsc/${encodeURIComponent(trimmed)}`);
    if (!res.ok) return '';
    const data = (await res.json()) as { bankName?: string | null };
    return data.bankName ?? '';
  } catch {
    return guessBankNameFromIfsc(trimmed);
  }
}

/**
 * Best-effort display name from IFSC bank code (first 4 letters).
 */
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

/**
 * Mobile normalization — same rules as login/signin OTP (10-digit India).
 */

/** Extract 10-digit mobile for OTP APIs (signin + delivery). */
export function toTenDigitMobile(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.slice(-10);
}

export function isValidIndianMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile);
}

export function formatIndianMobileDisplay(mobile: string): string {
  const digits = toTenDigitMobile(mobile);
  return isValidIndianMobile(digits) ? `+91 ${digits}` : '';
}

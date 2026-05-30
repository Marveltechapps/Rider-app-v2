/**
 * Edit profile validation (mirrors backend profile rules)
 */

export type ProfileFieldErrors = Partial<
  Record<'fullName' | 'phoneNumber' | 'email' | 'submit', string>
>;

const NAME_REGEX = /^[a-zA-Z][a-zA-Z\s.'-]{1,99}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

/** Normalize phone input for Indian mobiles (strips +91 / leading 0, keeps last 10 digits). */
export function sanitizePhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(-10);
  return digits.slice(0, 10);
}

/** Extract 10-digit mobile from stored values like "+91 7418268091". */
export function normalizePhoneDigits(phone: string): string {
  const digits = sanitizePhoneDigits(phone);
  if (digits.length <= 10) return digits;
  return digits.slice(-10);
}

export function validateFullName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return 'Full name is required';
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 100) return 'Name must be 100 characters or less';
  if (!NAME_REGEX.test(trimmed)) {
    return 'Use letters and spaces only';
  }
  return undefined;
}

export function validatePhoneNumber(
  phone: string,
  options?: { originalPhone?: string }
): string | undefined {
  const digits = sanitizePhoneDigits(phone);
  if (!digits) return 'Phone number is required';
  if (!INDIAN_MOBILE_REGEX.test(digits)) {
    return 'Enter a valid 10-digit mobile number starting with 6–9';
  }
  const original = options?.originalPhone
    ? normalizePhoneDigits(options.originalPhone)
    : '';
  if (original && digits !== original) {
    return 'Phone number can only be changed via OTP verification at login';
  }
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return 'Email address is required';
  if (trimmed.length > 254) return 'Email is too long';
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address';
  return undefined;
}

export interface ProfileFormInput {
  fullName: string;
  phoneNumber: string;
  email: string;
  originalPhoneNumber?: string;
}

export function validateProfileForm(input: ProfileFormInput): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  const nameErr = validateFullName(input.fullName);
  if (nameErr) errors.fullName = nameErr;

  const phoneErr = validatePhoneNumber(input.phoneNumber, {
    originalPhone: input.originalPhoneNumber,
  });
  if (phoneErr) errors.phoneNumber = phoneErr;

  const emailErr = validateEmail(input.email);
  if (emailErr) errors.email = emailErr;

  return errors;
}

export function mapApiProfileErrors(apiErrors: Record<string, string>): ProfileFieldErrors {
  const mapped: ProfileFieldErrors = {};
  for (const [key, message] of Object.entries(apiErrors)) {
    if (!message) continue;
    if (key === 'name' || key === 'fullName') mapped.fullName = message;
    else if (key === 'phoneNumber' || key === 'phone') mapped.phoneNumber = message;
    else if (key === 'email') mapped.email = message;
    else mapped.submit = message;
  }
  return mapped;
}

export function parseProfileValidationFromApi(raw: unknown): ProfileFieldErrors {
  const body =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const errors = body.errors;
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(errors as Record<string, unknown>)) {
      if (typeof v === 'string') flat[k] = v;
      else if (Array.isArray(v) && typeof v[0] === 'string') flat[k] = v[0];
    }
    return mapApiProfileErrors(flat);
  }
  const zodError = body.error;
  if (zodError && typeof zodError === 'object' && !Array.isArray(zodError)) {
    const fieldErrors = (zodError as { fieldErrors?: Record<string, string[]> }).fieldErrors;
    if (fieldErrors) {
      const flat: Record<string, string> = {};
      for (const [k, arr] of Object.entries(fieldErrors)) {
        if (Array.isArray(arr) && arr[0]) flat[k] = arr[0];
      }
      return mapApiProfileErrors(flat);
    }
  }
  const message =
    typeof body.message === 'string'
      ? body.message
      : typeof body.error === 'string'
        ? body.error
        : undefined;
  return message ? { submit: message } : {};
}

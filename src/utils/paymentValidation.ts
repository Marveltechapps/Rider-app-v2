/**
 * Bank & UPI payment details validation (mirrors backend rules)
 */

export type PaymentFieldErrors = Partial<
  Record<
    | 'accountHolderName'
    | 'accountNumber'
    | 'confirmAccountNumber'
    | 'ifscCode'
    | 'upiId'
    | 'submit',
    string
  >
>;

const HOLDER_REGEX = /^[a-zA-Z][a-zA-Z\s.'-]{1,99}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_REGEX = /^\d{9,18}$/;
const UPI_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;

export function sanitizeAccountNumber(value: string): string {
  return value.replace(/\D/g, '').slice(0, 18);
}

export function sanitizeIfsc(value: string): string {
  return value.replace(/\s/g, '').toUpperCase().slice(0, 11);
}

export function sanitizeUpiId(value: string): string {
  return value.trim().toLowerCase();
}

export function validateAccountHolderName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return 'Account holder name is required';
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 100) return 'Name must be 100 characters or less';
  if (!HOLDER_REGEX.test(trimmed)) {
    return 'Use letters and spaces only (as on your bank account)';
  }
  return undefined;
}

export function validateAccountNumber(accountNumber: string): string | undefined {
  const digits = sanitizeAccountNumber(accountNumber);
  if (!digits) return 'Account number is required';
  if (!ACCOUNT_REGEX.test(digits)) return 'Account number must be 9–18 digits';
  return undefined;
}

export function validateIfsc(ifscCode: string): string | undefined {
  const code = sanitizeIfsc(ifscCode);
  if (!code) return 'IFSC code is required';
  if (code.length !== 11) return 'IFSC must be 11 characters';
  if (!IFSC_REGEX.test(code)) return 'Invalid IFSC (e.g. HDFC0001234)';
  return undefined;
}

export function validateUpiId(upiId: string): string | undefined {
  const id = sanitizeUpiId(upiId);
  if (!id) return 'UPI ID is required';
  if (!UPI_REGEX.test(id)) return 'Enter a valid UPI ID (e.g. name@bank)';
  return undefined;
}

export interface BankFormInput {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
}

export function validateBankForm(input: BankFormInput): PaymentFieldErrors {
  const errors: PaymentFieldErrors = {};

  const holderErr = validateAccountHolderName(input.accountHolderName);
  if (holderErr) errors.accountHolderName = holderErr;

  const accErr = validateAccountNumber(input.accountNumber);
  if (accErr) errors.accountNumber = accErr;

  const confirmDigits = sanitizeAccountNumber(input.confirmAccountNumber);
  const accountDigits = sanitizeAccountNumber(input.accountNumber);
  if (!confirmDigits) {
    errors.confirmAccountNumber = 'Please confirm your account number';
  } else if (accountDigits && confirmDigits !== accountDigits) {
    errors.confirmAccountNumber = 'Account numbers do not match';
  }

  const ifscErr = validateIfsc(input.ifscCode);
  if (ifscErr) errors.ifscCode = ifscErr;

  return errors;
}

export interface UpiFormInput {
  accountHolderName: string;
  upiId: string;
}

export function validateUpiForm(input: UpiFormInput): PaymentFieldErrors {
  const errors: PaymentFieldErrors = {};

  const holderErr = validateAccountHolderName(input.accountHolderName);
  if (holderErr) errors.accountHolderName = holderErr;

  const upiErr = validateUpiId(input.upiId);
  if (upiErr) errors.upiId = upiErr;

  return errors;
}

/** Map API validation keys (e.g. bankDetails.accountNumber) to form field keys */
export function mapApiPaymentErrors(apiErrors: Record<string, string>): PaymentFieldErrors {
  const mapped: PaymentFieldErrors = {};
  for (const [key, message] of Object.entries(apiErrors)) {
    if (!message) continue;
    const shortKey = key.includes('.') ? key.split('.').pop()! : key;
    if (
      shortKey === 'accountHolderName' ||
      shortKey === 'accountNumber' ||
      shortKey === 'confirmAccountNumber' ||
      shortKey === 'ifscCode' ||
      shortKey === 'upiId'
    ) {
      mapped[shortKey as keyof PaymentFieldErrors] = message;
    } else {
      mapped.submit = message;
    }
  }
  return mapped;
}

export function parsePaymentValidationFromApi(raw: unknown): PaymentFieldErrors {
  const body = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const errors = body.errors;
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(errors as Record<string, unknown>)) {
      if (typeof v === 'string') flat[k] = v;
      else if (Array.isArray(v) && typeof v[0] === 'string') flat[k] = v[0];
    }
    return mapApiPaymentErrors(flat);
  }
  const message =
    typeof body.message === 'string'
      ? body.message
      : typeof body.error === 'string'
        ? body.error
        : undefined;
  return message ? { submit: message } : {};
}

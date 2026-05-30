/**
 * Payment types
 */

import type { RiderProfile } from '../api/rider';

export type PaymentMethodType = 'none' | 'bank' | 'upi';

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface UpiDetails {
  accountHolderName: string;
  upiId: string;
}

export type PaymentMethod =
  | { type: 'none'; isVerified: false }
  | { type: 'bank'; bankDetails: BankDetails; isVerified: boolean }
  | { type: 'upi'; upiDetails: UpiDetails; isVerified: boolean };

export const INITIAL_PAYMENT: PaymentMethod = { type: 'none', isVerified: false };

export function hasCompleteBankDetails(b: RiderProfile['bankDetails']): boolean {
  return !!(
    b?.accountNumber?.trim() &&
    b?.ifscCode?.trim() &&
    b?.accountHolderName?.trim()
  );
}

export function hasCompleteUpiDetails(u: RiderProfile['upiDetails']): boolean {
  return !!(u?.upiId?.trim() && u?.accountHolderName?.trim());
}

/** Builds payment state from server profile (no mock defaults). */
export function paymentMethodFromRiderProfile(rider: RiderProfile): PaymentMethod {
  if (hasCompleteBankDetails(rider.bankDetails)) {
    const b = rider.bankDetails!;
    return {
      type: 'bank',
      isVerified: true,
      bankDetails: {
        accountHolderName: b.accountHolderName ?? '',
        accountNumber: b.accountNumber ?? '',
        ifscCode: b.ifscCode ?? '',
        bankName: b.bankName ?? '',
      },
    };
  }
  if (hasCompleteUpiDetails(rider.upiDetails)) {
    const u = rider.upiDetails!;
    return {
      type: 'upi',
      isVerified: true,
      upiDetails: {
        accountHolderName: u.accountHolderName ?? '',
        upiId: u.upiId ?? '',
      },
    };
  }
  return INITIAL_PAYMENT;
}

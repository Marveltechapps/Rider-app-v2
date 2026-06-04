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

function buildBankMethod(rider: RiderProfile): PaymentMethod {
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

function buildUpiMethod(rider: RiderProfile): PaymentMethod {
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

export interface RiderPayoutDetails {
  bank: BankDetails | null;
  upi: UpiDetails | null;
  primaryPayoutMethod?: 'bank' | 'upi';
}

export function riderPayoutDetailsFromProfile(rider: RiderProfile): RiderPayoutDetails {
  const bank = hasCompleteBankDetails(rider.bankDetails)
    ? {
        accountHolderName: rider.bankDetails!.accountHolderName ?? '',
        accountNumber: rider.bankDetails!.accountNumber ?? '',
        ifscCode: rider.bankDetails!.ifscCode ?? '',
        bankName: rider.bankDetails!.bankName ?? '',
      }
    : null;

  const upi = hasCompleteUpiDetails(rider.upiDetails)
    ? {
        accountHolderName: rider.upiDetails!.accountHolderName ?? '',
        upiId: rider.upiDetails!.upiId ?? '',
      }
    : null;

  return {
    bank,
    upi,
    primaryPayoutMethod: rider.primaryPayoutMethod,
  };
}

/** Primary payout method for cash-out (when both bank and UPI exist). */
export function paymentMethodFromRiderProfile(rider: RiderProfile): PaymentMethod {
  const hasBank = hasCompleteBankDetails(rider.bankDetails);
  const hasUpi = hasCompleteUpiDetails(rider.upiDetails);

  if (!hasBank && !hasUpi) {
    return INITIAL_PAYMENT;
  }

  const primary = rider.primaryPayoutMethod;
  if (primary === 'upi' && hasUpi) {
    return buildUpiMethod(rider);
  }
  if (primary === 'bank' && hasBank) {
    return buildBankMethod(rider);
  }
  if (hasUpi && !hasBank) {
    return buildUpiMethod(rider);
  }
  if (hasBank) {
    return buildBankMethod(rider);
  }
  return buildUpiMethod(rider);
}

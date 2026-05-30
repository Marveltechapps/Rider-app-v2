/**
 * Payouts API – list, statement, request payout
 */

import { api } from './client';

export interface PayoutItem {
  _id?: string;
  riderId: string;
  periodStart: string;
  periodEnd: string;
  amount?: number;
  status?: string;
  method?: string;
  createdAt?: string;
}

export interface PayoutsListResponse {
  payouts: PayoutItem[];
}

export interface PayoutStatementResponse {
  statement: unknown;
}

export type EarningsPeriod = 'today' | 'week' | 'month';

export interface EarningsSummaryResponse {
  totalEarnings: number;
  orderCount: number;
  periodStart: string;
  periodEnd: string;
  dailyBreakdown?: { dayLabel: string; value: number; orderCount: number }[];
}

/** Get earnings summary for the authenticated rider (today / week / month). */
export async function getEarningsSummary(period: EarningsPeriod): Promise<EarningsSummaryResponse> {
  return api.get<EarningsSummaryResponse>(`/api/v1/payouts/summary?period=${period}`);
}

/** List payouts for the authenticated rider */
export async function listPayouts(limit = 20): Promise<PayoutsListResponse> {
  return api.get<PayoutsListResponse>(`/api/v1/payouts?limit=${limit}`);
}

/** Get payout statement */
export async function getStatement(): Promise<PayoutStatementResponse> {
  return api.get<PayoutStatementResponse>('/api/v1/payouts/statement');
}

/** Request a payout */
export async function requestPayout(body: {
  periodStart: string;
  periodEnd: string;
  method: 'bank_transfer' | 'upi' | 'wallet';
  accountDetails: {
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    walletId?: string;
    bankName?: string;
    accountHolderName?: string;
  };
}): Promise<{ payout: PayoutItem }> {
  return api.post<{ payout: PayoutItem }>('/api/v1/payouts/request', body);
}

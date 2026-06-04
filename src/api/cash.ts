/**
 * Rider floating cash – COD collected vs deposited
 */

import { api } from './client';

export interface CashTransaction {
  id: string;
  type: 'collected' | 'deposited';
  title: string;
  amount: number;
  dateTime: string;
  orderId?: string;
  referenceId?: string;
  status?: string;
}

export interface CashSummary {
  totalCollected: number;
  totalDeposited: number;
  cashToDeposit: number;
  transactionCount: number;
}

export async function getCashSummary(): Promise<CashSummary> {
  return api.get<CashSummary>('/api/v1/rider/cash/summary');
}

export async function getCashTransactions(limit = 50): Promise<{ transactions: CashTransaction[] }> {
  return api.get<{ transactions: CashTransaction[] }>(`/api/v1/rider/cash/transactions?limit=${limit}`);
}

export async function depositCash(body: {
  amount: number;
  method?: 'upi' | 'cash' | 'net_banking';
  referenceId?: string;
  note?: string;
}): Promise<{ deposit: unknown; message?: string }> {
  return api.post<{ deposit: unknown; message?: string }>('/api/v1/rider/cash/deposit', body);
}

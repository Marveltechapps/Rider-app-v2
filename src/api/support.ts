/**
 * Support API – create tickets from rider app (public, no auth)
 * POST /api/v1/support/tickets
 */

import { getBaseUrlOrThrow } from './config';

export interface CreateTicketRequest {
  subject: string;
  description?: string;
  category?: string;
  priority?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderNumber?: string;
}

export interface CreateTicketResponse {
  success: boolean;
  data?: { id: string; ticketNumber: string; subject: string; status: string };
  error?: string;
}

export async function createSupportTicket(body: CreateTicketRequest): Promise<CreateTicketResponse> {
  try {
    const base = getBaseUrlOrThrow();
    const res = await fetch(`${base}/api/v1/support/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, source: 'rider' }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error ?? data.message ?? 'Failed to create ticket' };
    }
    return { success: true, data: data.data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Network error',
    };
  }
}

/**
 * Rider home API – consumes backend /api/v1/delivery/home
 * This uses only real backend data, with no synthetic operational fallbacks.
 */

import { api } from './client';

export interface RiderSnapshot {
  riderId: string;
  name: string;
  phoneNumber: string;
  email: string | null;
  status: string;
  availability: string;
  currentShift: {
    shiftId: string;
    startedAt: string;
    warehouseCode: string; // Rider's hub; kept for shift context
    darkstoreCode?: string;
  } | null;
  currentLocation: {
    lat: number;
    lng: number;
    updatedAt: string;
  } | null;
}

export interface TodaySummary {
  ordersAssigned: number;
  ordersCompleted: number;
  ordersCancelled: number;
  onTimeCount: number;
  lateCount: number;
  amountCollectedCod: number;
  earningsToday: number;
  onlineHours: number;
  slotsCompleted: number;
  incentiveEarned: number;
}

export interface HomeTask {
  orderNumber: string;
  status: string;
  paymentMethod: string | null;
  paymentStatus: string | null;
  codAmount: number | null;
  deliveryAddress: any | null;
  scheduledTime: string | null;
  customerPhoneNumber: string;
  darkstoreCode: string;
  /** @deprecated Use darkstoreCode */
  warehouseCode?: string;
  itemsCount: number;
}

export interface HomeConfig {
  banners: Array<{
    title: string;
    description?: string;
    priorityLevel?: string;
  }>;
  features: Record<string, unknown>;
}

export interface RiderHomePayload {
  rider: RiderSnapshot;
  todaySummary: TodaySummary;
  activeTask: HomeTask | null;
  queue: HomeTask[];
  homeConfig: HomeConfig;
}

export async function getHome(): Promise<RiderHomePayload> {
  return api.get<RiderHomePayload>('/api/v1/delivery/home');
}


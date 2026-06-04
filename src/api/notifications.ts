/**
 * Rider notifications – synced with dashboard notification center
 */

import { api } from './client';

export interface RiderNotification {
  id: string;
  title: string;
  message?: string;
  type?: string;
  read?: boolean;
  createdAt?: string;
}

export async function listNotifications(limit = 30): Promise<RiderNotification[]> {
  const res = await api.get<{ success?: boolean; data?: RiderNotification[] }>(
    `/api/v1/rider/notifications?limit=${limit}`
  );
  return res.data ?? [];
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/api/v1/rider/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post('/api/v1/rider/notifications/read-all', {});
}

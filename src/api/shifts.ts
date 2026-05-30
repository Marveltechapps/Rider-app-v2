import { api } from './client';
import { getStoredRiderId } from './storage';

export interface BackendRiderShift {
  id: string;
  hubId?: string;
  hubName?: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  capacity: number;
  bookedCount: number;
  status?: string;
  isPeak: boolean;
  basePay: number;
  bonus: number;
  currency: string;
  breakMinutes: number;
  walkInBufferMinutes: number;
  assignmentId?: string;
  assignmentStatus?: string;
  startedAt?: string | null;
  endedAt?: string | null;
  attendanceMinutes?: number;
  attendancePercentage?: number;
  completionStatus?: 'upcoming' | 'ongoing' | 'completed' | 'missed';
}

function buildShiftQuery(date?: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  const riderId = extra?.riderId;
  if (riderId) params.append('riderId', riderId);
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      if (key !== 'riderId' && value) params.append(key, value);
    });
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function getAvailableShifts(date: string): Promise<BackendRiderShift[]> {
  const riderId = await getStoredRiderId();
  const path = `/api/v1/rider/shifts/available/list${buildShiftQuery(date, riderId ? { riderId } : undefined)}`;
  const data = await api.get<BackendRiderShift[]>(path);
  return Array.isArray(data) ? data : [];
}

export async function selectShifts(selectedShiftIds: string[]) {
  const riderId = await getStoredRiderId();
  await api.post('/api/v1/rider/shifts/select', { selectedShifts: selectedShiftIds, riderId });
}

export async function cancelSelectedShift(shiftId: string) {
  const riderId = await getStoredRiderId();
  await api.post('/api/v1/rider/shifts/cancel', { shiftId, riderId });
}

export async function startShift(shiftId: string) {
  const riderId = await getStoredRiderId();
  const data = await api.post<{ shiftStartTime: string }>('/api/v1/rider/shifts/start', {
    shiftId,
    riderId,
  });
  return data;
}

export async function endShift(shiftId: string) {
  const riderId = await getStoredRiderId();
  await api.post('/api/v1/rider/shifts/end', { shiftId, riderId });
}

export async function getMyShifts(date?: string): Promise<BackendRiderShift[]> {
  const riderId = await getStoredRiderId();
  const path = `/api/v1/rider/shifts/my${buildShiftQuery(date, riderId ? { riderId } : undefined)}`;
  const data = await api.get<BackendRiderShift[]>(path);
  return Array.isArray(data) ? data : [];
}

import type { BackendRiderShift } from '../api/shifts';
import type { Shift } from '../components/features/ShiftCard';

/** Local calendar date as YYYY-MM-DD (avoids UTC off-by-one from toISOString). */
export function formatDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function durationHoursFromMinutes(durationMinutes: number): number {
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) return 1;
  return Math.max(1, Math.round(durationMinutes / 60));
}

/** Duration filter chips: 2, 4, 6, 10, 12 hour buckets. */
export function matchesDurationFilter(durationMinutes: number, filterHours: string): boolean {
  if (filterHours === 'all') return true;
  const target = parseInt(filterHours, 10);
  if (Number.isNaN(target)) return true;
  const hours = durationHoursFromMinutes(durationMinutes);
  return hours === target;
}

export function mapBackendShiftToCard(s: BackendRiderShift): Shift {
  return {
    id: s.id,
    startTime: s.startTime,
    endTime: s.endTime,
    durationHours: durationHoursFromMinutes(s.durationMinutes),
    hasBreak: (s.breakMinutes ?? 0) > 0,
    breakMinutes: s.breakMinutes,
    isPeakTime: s.isPeak,
    hasIncentive: (s.basePay ?? 0) > 0 || (s.bonus ?? 0) > 0,
    incentiveAmount: s.bonus ?? 0,
    basePay: s.basePay,
    bookedCount: s.bookedCount,
    capacity: s.capacity,
    hubName: s.hubName,
    date: typeof s.date === 'string' ? s.date : s.date ? String(s.date) : undefined,
  };
}

/**
 * Bag assignment + scan verification for Collect Bag screen.
 */

import type { BackendOrder } from '../api/orders';

export function normalizeBagCode(value: string): string {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

/** Expected bag barcode for this order (from backend metadata or order number fallback). */
export function getAssignedBagId(order?: BackendOrder | null): string {
  if (!order) return '';
  const meta = order.metadata as { bagId?: string; assignedBagId?: string } | undefined;
  const fromMeta = meta?.bagId || meta?.assignedBagId;
  if (fromMeta && String(fromMeta).trim()) return normalizeBagCode(String(fromMeta));
  if (order.orderNumber) return normalizeBagCode(`BAG-${order.orderNumber}`);
  return '';
}

export function getDarkstoreCode(order?: BackendOrder | null): string {
  return (order?.darkstoreCode || order?.warehouseCode || '').trim();
}

export function bagCodesMatch(scanned: string, expected: string): boolean {
  const a = normalizeBagCode(scanned);
  const b = normalizeBagCode(expected);
  if (!a || !b) return false;
  return a === b;
}

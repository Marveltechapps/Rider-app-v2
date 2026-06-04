/**
 * Operational delivery workflow — route resolution by backend order status.
 */

import type { BackendOrder } from '../api/orders';

export type WorkflowRoute =
  | '/accepted-order'
  | '/travel-to-darkstore'
  | '/collect-bag'
  | '/customer-navigation'
  | '/customer-otp-verification'
  | '/delivery-photo'
  | '/delivery-complete'
  | '/order-details';

export function getWorkflowRoute(order: BackendOrder): WorkflowRoute {
  const status = (order.status || '').toLowerCase();
  const meta = order.metadata ?? {};

  if (status === 'delivered') return '/delivery-complete';

  if (status === 'arrived_at_customer' || status === 'out_for_delivery') {
    if (!meta.deliveryOtpVerifiedAt) return '/customer-otp-verification';
    return '/delivery-photo';
  }

  if (status === 'picked') return '/customer-navigation';
  if (status === 'arrived_at_darkstore') return '/collect-bag';
  if (status === 'assigned') {
    return order.riderAssignment?.acceptedAt ? '/travel-to-darkstore' : '/accepted-order';
  }

  return '/order-details';
}

export function isActiveDeliveryStatus(status: string): boolean {
  return [
    'assigned',
    'arrived_at_darkstore',
    'picked',
    'out_for_delivery',
    'arrived_at_customer',
  ].includes((status || '').toLowerCase());
}

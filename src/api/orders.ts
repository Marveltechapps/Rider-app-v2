/**
 * Orders API – list, get, accept, reject, pick, out-for-delivery, deliver
 */

import { api } from './client';

export interface OrderItem {
  skuId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface OrderDelivery {
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    coordinates?: { lat: number; lng: number };
  };
  slot: string;
  scheduledTime?: string;
  instructions?: string;
}

export interface OrderPayment {
  method: 'cod' | 'card' | 'upi' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
}

export interface OrderPricing {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
}

export interface RiderAssignment {
  riderId: string;
  assignedAt?: string;
  pickedAt?: string;
  deliveredAt?: string;
}

export interface BackendOrder {
  _id: string;
  orderNumber: string;
  customerPhoneNumber?: string;
  darkstoreCode?: string;
  /** @deprecated Use darkstoreCode. Kept for backward compatibility with existing documents. */
  warehouseCode?: string;
  items: OrderItem[];
  delivery: OrderDelivery;
  payment?: OrderPayment;
  pricing?: OrderPricing;
  riderAssignment?: RiderAssignment;
  status: string;
  estimatedPayout?: number;
  createdAt?: string;
  metadata?: { etaMinutes?: number; estimatedDistanceKm?: number };
}

export interface ListOrdersResponse {
  orders: BackendOrder[];
  count: number;
}

export interface OrderDetailResponse {
  order: BackendOrder;
}

/** List orders for the authenticated rider (my orders) */
export async function listOrders(params?: { status?: string; darkstoreCode?: string; limit?: number }): Promise<ListOrdersResponse> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.darkstoreCode) q.set('darkstoreCode', params.darkstoreCode);
  if (params?.limit) q.set('limit', String(params.limit));
  const query = q.toString();
  return api.get<ListOrdersResponse>(`/api/v1/orders/admin/orders${query ? `?${query}` : ''}`);
}

/** Get single order by ID */
export async function getOrder(orderId: string): Promise<OrderDetailResponse> {
  return api.get<OrderDetailResponse>(`/api/v1/orders/${orderId}`);
}

/** Accept order */
export async function acceptOrder(orderId: string): Promise<{ order: BackendOrder }> {
  return api.post<{ order: BackendOrder }>(`/api/v1/orders/${orderId}/accept`, {});
}

/** Reject order */
export async function rejectOrder(orderId: string, reason?: string): Promise<{ order: BackendOrder }> {
  return api.post<{ order: BackendOrder }>(`/api/v1/orders/${orderId}/reject`, reason ? { reason } : {});
}

/** Mark order as picked */
export async function pickOrder(orderId: string): Promise<{ order: BackendOrder }> {
  return api.post<{ order: BackendOrder }>(`/api/v1/orders/${orderId}/pick`, {});
}

/** Mark order out for delivery */
export async function outForDeliveryOrder(orderId: string): Promise<{ order: BackendOrder }> {
  return api.post<{ order: BackendOrder }>(`/api/v1/orders/${orderId}/out-for-delivery`, {});
}

/** Mark order as delivered (optional proof) */
export async function deliverOrder(
  orderId: string,
  proof?: { type: 'otp' | 'signature' | 'photo'; value: string }
): Promise<{ order: BackendOrder }> {
  return api.post<{ order: BackendOrder }>(`/api/v1/orders/${orderId}/deliver`, proof ? { proofOfDelivery: proof } : {});
}

/** Mark COD as collected for an order */
export async function markCodCollected(orderId: string): Promise<{ order: BackendOrder }> {
  return api.post<{ order: BackendOrder }>(`/api/v1/orders/${orderId}/payment/mark-collected`, {});
}

/** Get UPI payment intent URI for an order */
export async function getUpiIntent(orderId: string): Promise<{ upiUri: string; vpa: string; payeeName: string; amount: number; orderNumber: string }> {
  return api.get<{ upiUri: string; vpa: string; payeeName: string; amount: number; orderNumber: string }>(`/api/v1/orders/${orderId}/payment/upi-intent`);
}

/** Upload delivery proof photo and receive a public URL */
export async function uploadDeliveryProofPhoto(orderId: string, file: { uri: string; name?: string; type?: string }): Promise<{ url: string; key: string }> {
  const form = new FormData();
  form.append('file', {
    // React Native / Expo FormData file type
    uri: file.uri,
    name: file.name ?? 'proof.jpg',
    type: file.type ?? 'image/jpeg',
  } as any);
  // Do not set Content-Type manually; fetch will add the correct boundary for multipart.
  return api.post<{ url: string; key: string }>(`/api/v1/orders/${orderId}/proof/photo`, form);
}

/** Send delivery OTP to the customer for this order */
export async function sendDeliveryOtp(
  orderId: string,
  args?: { mobileNumber?: string }
): Promise<{ message: string; expiresInSec?: number }> {
  return api.post<{ message: string; expiresInSec?: number }>(`/api/v1/orders/${orderId}/otp/send`, args?.mobileNumber ? { mobileNumber: args.mobileNumber } : {});
}

/** Verify delivery OTP for this order */
export async function verifyDeliveryOtp(orderId: string, otp: string): Promise<{ verified: boolean; message?: string }> {
  return api.post<{ verified: boolean; message?: string }>(`/api/v1/orders/${orderId}/otp/verify`, { otp });
}

/** Map backend order to history list Order shape (OrderCard in history). */
export function mapBackendOrderToHistoryOrder(order: BackendOrder): {
  id: string;
  date: string;
  time: string;
  durationMins: number;
  storeName: string;
  area: string;
  distanceKm: number;
  itemsCount: number;
  payout: number;
  status: 'delivered' | 'cancelled' | 'returned';
} {
  const d = order.createdAt ? new Date(order.createdAt) : new Date();
  const dateStr = d.toISOString().split('T')[0];
  const timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  const addr = order.delivery?.address;
  const area = addr ? [addr.addressLine1, addr.city].filter(Boolean).join(', ') : '—';
  const itemCount = order.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0;
  return {
    id: order._id,
    date: dateStr,
    time: timeStr,
    durationMins: 0,
    storeName: (order.darkstoreCode || order.warehouseCode) ? `Darkstore ${order.darkstoreCode || order.warehouseCode}` : 'Hub',
    area,
    distanceKm: 0,
    itemsCount: itemCount,
    payout: order.estimatedPayout ?? 0,
    status: (order.status === 'delivered' ? 'delivered' : order.status === 'cancelled' ? 'cancelled' : 'returned') as 'delivered' | 'cancelled' | 'returned',
  };
}

/** Format delivery time from slot and scheduledTime */
function formatDeliveryTime(order: BackendOrder): string {
  const slot = order.delivery?.slot?.toLowerCase();
  const scheduledTime = order.delivery?.scheduledTime;
  if (slot === 'asap' || !scheduledTime) {
    const eta = order.metadata?.etaMinutes;
    return eta ? `~${eta} min` : 'ASAP';
  }
  try {
    const d = new Date(scheduledTime);
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return 'ASAP';
  }
}

/** Format distance from metadata or coordinates */
function formatDistance(order: BackendOrder): string {
  const km = order.metadata?.estimatedDistanceKm;
  if (km != null && km > 0) return `~${km.toFixed(1)} km`;
  return '—';
}

/** Map backend order to frontend OrderCard shape. orderId is set to _id so API calls (pick, deliver) work. */
export function mapOrderToCard(order: BackendOrder): {
  id: string;
  orderId: string;
  displayOrderNumber?: string;
  estimatedPayout: number;
  pickupLocation: string;
  pickupBay?: string;
  deliveryLocation: string;
  distance: string;
  time: string;
  items: number;
  isPriority?: boolean;
} {
  const addr = order.delivery?.address;
  const deliveryLine = addr
    ? [addr.addressLine1, addr.addressLine2, addr.city, addr.pincode].filter(Boolean).join(', ')
    : 'Delivery address';
  const itemCount = order.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0;
  return {
    id: order._id,
    orderId: order._id, // use _id so pick/deliver API receives valid id
    displayOrderNumber: order.orderNumber || order._id,
    estimatedPayout: order.estimatedPayout ?? 0,
    pickupLocation: (order.darkstoreCode || order.warehouseCode) ? `Darkstore ${order.darkstoreCode || order.warehouseCode}` : 'Hub',
    deliveryLocation: deliveryLine,
    distance: formatDistance(order),
    time: formatDeliveryTime(order),
    items: itemCount,
    isPriority: false,
  };
}

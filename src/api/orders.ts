/**
 * Orders API – list, get, accept, reject, pick, out-for-delivery, deliver
 */

import { api } from './client';
import { API_BASE_URL_ENV_KEY, getBaseUrlOrThrow } from './config';
import { asRecord, getApiErrorMessage } from './parseResponse';
import { getStoredAccessToken } from './storage';
import { isValidIndianMobile, toTenDigitMobile } from '../utils/phoneNumber';
import { formatDeliveryAddress, getOrderDistanceLabel, getPickupLabel } from '../utils/fleetMapCoords';

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
  acceptedAt?: string;
  arrivedAtDarkstore?: string;
  arrivedAtCustomer?: string;
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
  metadata?: {
    etaMinutes?: number;
    estimatedDistanceKm?: number;
    pickupCoordinates?: { lat: number; lng: number };
    dropCoordinates?: { lat: number; lng: number };
    pickupAddress?: string;
    deliveryOtp?: string;
    deliveryOtpSentAt?: string;
    deliveryOtpVerifiedAt?: string;
    deliveryProofPhotoUrl?: string;
    deliveryProofPhotoKey?: string;
    bagCollectedAt?: string;
    bagId?: string;
    assignedBagId?: string;
    rackLocation?: string;
    bagVerifiedAt?: string;
  };
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

/** Mark rider arrived at darkstore */
export async function arrivedAtDarkstore(orderId: string): Promise<{ order: BackendOrder }> {
  return api.post<{ order: BackendOrder }>(`/api/v1/orders/${orderId}/arrived-at-darkstore`, {});
}

/** Mark rider arrived at customer */
export async function arrivedAtCustomer(orderId: string): Promise<{ order: BackendOrder }> {
  return api.post<{ order: BackendOrder }>(`/api/v1/orders/${orderId}/arrived-at-customer`, {});
}

/** Mark order as picked (bag collected) */
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

/** Upload delivery proof photo to AWS S3 (via backend) and receive public URL + key */
export async function uploadDeliveryProofPhoto(
  orderId: string,
  file: { uri: string; name?: string; type?: string }
): Promise<{ success: boolean; url: string; key?: string; message?: string }> {
  const form = new FormData();
  form.append('file', {
    uri: file.uri,
    name: file.name ?? 'proof.jpg',
    type: file.type ?? 'image/jpeg',
  } as any);
  const raw = await api.post<Record<string, unknown>>(`/api/v1/orders/${orderId}/proof/photo`, form);
  const body = asRecord(raw);
  const url = typeof body.url === 'string' ? body.url : '';
  if (!url) {
    throw new Error(getApiErrorMessage(body, 500) || 'Photo upload failed');
  }
  return {
    success: body.success !== false,
    url,
    key: typeof body.key === 'string' ? body.key : undefined,
    message: typeof body.message === 'string' ? body.message : undefined,
  };
}

export type DeliveryOtpSendResult = {
  success: boolean;
  otpSent: boolean;
  message: string;
  expiresInSec?: number;
  mobileNumber?: string;
};

export type DeliveryOtpVerifyResult = {
  success: boolean;
  verified: boolean;
  message?: string;
};

/** Send delivery OTP to the customer's mobile (rider must tap Send OTP). */
export async function sendDeliveryOtp(
  orderId: string,
  args?: { mobileNumber?: string }
): Promise<DeliveryOtpSendResult> {
  const mobile = args?.mobileNumber ? toTenDigitMobile(args.mobileNumber) : '';
  if (mobile && !isValidIndianMobile(mobile)) {
    throw new Error('Phone number must be 10 digits (or 12 with 91).');
  }
  const base = getBaseUrlOrThrow();
  const token = await getStoredAccessToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${base}/api/v1/orders/${orderId}/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(mobile ? { mobileNumber: mobile } : {}),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(getApiErrorMessage(asRecord(raw), res.status));
    }
    const body = asRecord(raw);
    const expiresIn =
      typeof body.expiresIn === 'number'
        ? body.expiresIn
        : typeof body.expiresInSec === 'number'
          ? body.expiresInSec
          : undefined;
    return {
      success: body.success !== false,
      otpSent: body.otpSent !== false,
      message: typeof body.message === 'string' ? body.message : 'OTP sent successfully',
      expiresInSec: expiresIn,
      mobileNumber: typeof body.mobileNumber === 'string' ? body.mobileNumber : mobile || undefined,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      const message = err.message || '';
      if (
        message.includes('API base URL') ||
        message.includes(API_BASE_URL_ENV_KEY) ||
        message.includes('is not set')
      ) {
        throw err;
      }
      if (
        err.name === 'AbortError' ||
        message.includes('Network request failed') ||
        message.includes('Failed to fetch')
      ) {
        throw new Error('Unable to send OTP right now. Please try again in a moment.');
      }
      throw err;
    }
    throw err;
  }
}

/** Resend delivery OTP (same as send; new code + expiry). */
export async function resendDeliveryOtp(
  orderId: string,
  args?: { mobileNumber?: string }
): Promise<DeliveryOtpSendResult> {
  const mobile = args?.mobileNumber ? toTenDigitMobile(args.mobileNumber) : '';
  if (mobile && !isValidIndianMobile(mobile)) {
    throw new Error('Phone number must be 10 digits (or 12 with 91).');
  }
  const base = getBaseUrlOrThrow();
  const token = await getStoredAccessToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${base}/api/v1/orders/${orderId}/otp/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(mobile ? { mobileNumber: mobile } : {}),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(getApiErrorMessage(asRecord(raw), res.status));
    }
    const body = asRecord(raw);
    const expiresIn =
      typeof body.expiresIn === 'number'
        ? body.expiresIn
        : typeof body.expiresInSec === 'number'
          ? body.expiresInSec
          : undefined;
    return {
      success: body.success !== false,
      otpSent: body.otpSent !== false,
      message: typeof body.message === 'string' ? body.message : 'OTP resent successfully',
      expiresInSec: expiresIn,
      mobileNumber: typeof body.mobileNumber === 'string' ? body.mobileNumber : mobile || undefined,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      const message = err.message || '';
      if (
        err.name === 'AbortError' ||
        message.includes('Network request failed') ||
        message.includes('Failed to fetch')
      ) {
        throw new Error('Unable to resend OTP right now. Please try again in a moment.');
      }
      throw err;
    }
    throw err;
  }
}

/** Verify delivery OTP server-side. Returns verified:false on wrong/expired OTP without throwing. */
export async function verifyDeliveryOtp(
  orderId: string,
  otp: string
): Promise<DeliveryOtpVerifyResult> {
  const digits = otp.replace(/\D/g, '').trim();
  const base = getBaseUrlOrThrow();
  const token = await getStoredAccessToken();
  const res = await fetch(`${base}/api/v1/orders/${orderId}/otp/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ otp: digits }),
  });
  const raw = await res.json().catch(() => ({}));
  const body = asRecord(raw);
  if (res.ok) {
    const verified = body.verified === true;
    return {
      success: body.success !== false && verified,
      verified,
      message: typeof body.message === 'string' ? body.message : undefined,
    };
  }
  if (body.verified === false || res.status === 400 || res.status === 403 || res.status === 404) {
    return {
      success: false,
      verified: false,
      message:
        (typeof body.message === 'string' && body.message) ||
        (typeof body.error === 'string' && body.error) ||
        getApiErrorMessage(body, res.status),
    };
  }
  throw new Error(getApiErrorMessage(body, res.status));
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
  return getOrderDistanceLabel(order);
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
  const deliveryLine = formatDeliveryAddress(order);
  const itemCount = order.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0;
  return {
    id: order._id,
    orderId: order._id, // use _id so pick/deliver API receives valid id
    displayOrderNumber: order.orderNumber || order._id,
    estimatedPayout: order.estimatedPayout ?? 0,
    pickupLocation: getPickupLabel(order) || 'Hub',
    deliveryLocation: deliveryLine,
    distance: formatDistance(order),
    time: formatDeliveryTime(order),
    items: itemCount,
    isPriority: false,
  };
}

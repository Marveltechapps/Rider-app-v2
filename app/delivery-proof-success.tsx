/**
 * Deprecated — redirects to delivery complete. Kept so old deep links do not break.
 */

import { Redirect, useLocalSearchParams } from 'expo-router';

export default function DeliveryProofSuccess() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  return (
    <Redirect
      href={{
        pathname: '/delivery-photo',
        params: orderId ? { orderId } : {},
      }}
    />
  );
}

import { Redirect, useLocalSearchParams } from 'expo-router';

/** Legacy route — redirects to customer navigation screen. */
export default function DeliveryRedirect() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  return <Redirect href={{ pathname: '/customer-navigation', params: { orderId: orderId ?? '' } }} />;
}

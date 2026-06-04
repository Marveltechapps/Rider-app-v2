import { Redirect, useLocalSearchParams } from 'expo-router';

/** Legacy route — redirects to collect bag screen. */
export default function VerifyHubItemsRedirect() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  return <Redirect href={{ pathname: '/collect-bag', params: { orderId: orderId ?? '' } }} />;
}

import { Redirect, useLocalSearchParams } from 'expo-router';

/** Legacy route — redirects to operational travel screen. */
export default function LiveOrderMapRedirect() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  return <Redirect href={{ pathname: '/travel-to-darkstore', params: { orderId: orderId ?? '' } }} />;
}

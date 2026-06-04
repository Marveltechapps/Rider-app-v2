import { useLocalSearchParams } from 'expo-router';
import AcceptedOrderScreen from '../src/screens/AcceptedOrderScreen';

export default function AcceptedOrder() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  return <AcceptedOrderScreen orderId={orderId} />;
}

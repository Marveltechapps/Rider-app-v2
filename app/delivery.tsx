import { useLocalSearchParams } from 'expo-router';
import DeliveryScreen from '../src/screens/DeliveryScreen';

export default function Delivery() {
  const params = useLocalSearchParams();
  return <DeliveryScreen {...params} />;
}


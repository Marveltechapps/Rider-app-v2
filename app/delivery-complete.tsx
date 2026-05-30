import { useLocalSearchParams } from 'expo-router';
import DeliveryCompleteScreen from '../src/screens/DeliveryCompleteScreen';

export default function DeliveryComplete() {
  const params = useLocalSearchParams();
  return <DeliveryCompleteScreen {...params} />;
}

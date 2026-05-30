import { useLocalSearchParams } from 'expo-router';
import HandoverOrderScreen from '../src/screens/HandoverOrderScreen';

export default function HandoverOrder() {
  const params = useLocalSearchParams();
  return <HandoverOrderScreen {...params} />;
}


import { useLocalSearchParams } from 'expo-router';
import VerifyHubItemsScreen from '../src/screens/VerifyHubItemsScreen';

export default function VerifyHubItems() {
  const params = useLocalSearchParams();
  return <VerifyHubItemsScreen {...params} />;
}


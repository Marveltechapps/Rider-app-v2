/**
 * Order Details Route
 * Entry point for the order details screen
 */

import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import OrderDetailsScreen from '../src/screens/OrderDetailsScreen';

export default function OrderDetails() {
  const params = useLocalSearchParams();

  // Log params for debugging navigation flow
  useEffect(() => {
    console.log('OrderDetails Route - Received params:', params);
  }, [params]);

  return <OrderDetailsScreen />;
}


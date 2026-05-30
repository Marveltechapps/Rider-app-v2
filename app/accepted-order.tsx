/**
 * Accepted Order Screen Route
 * Entry point for the accepted order screen
 */

import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import AcceptedOrderScreen from '../src/screens/AcceptedOrderScreen';

export default function AcceptedOrder() {
  const params = useLocalSearchParams<{
    orderId?: string;
    estimatedPayout?: string;
    pickupLocation?: string;
    pickupBay?: string;
    deliveryLocation?: string;
    distance?: string;
    time?: string;
    items?: string;
  }>();

  // Log params for debugging navigation flow
  useEffect(() => {
    console.log('AcceptedOrder Route - Received params:', params);
  }, [params]);
  
  return <AcceptedOrderScreen {...params} />;
}


/**
 * Step 1 — Order accepted summary (details before travel to darkstore).
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import HubStoreIcon from '../components/icons/HubStoreIcon';
import CustomerAvatarIcon from '../components/icons/CustomerAvatarIcon';
import RupeeIcon from '../components/icons/RupeeIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { invalidateActiveOrder, useActiveOrder } from '../hooks/useActiveOrder';
import { useQueryClient } from '@tanstack/react-query';
import acceptedOrderStyles from '../styles/acceptedOrderStyles';
import {
  formatCustomerPhone,
  formatDeliveryAddress,
  getOrderDistanceLabel,
  getPickupLabel,
} from '../utils/fleetMapCoords';
import { scale, verticalScale } from '../utils/responsive';

interface AcceptedOrderScreenProps {
  orderId?: string;
}

export default function AcceptedOrderScreen({ orderId: paramOrderId }: AcceptedOrderScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = paramOrderId ?? '';
  const { order, isLoading: orderLoading } = useActiveOrder(orderId);

  const displayOrderId = order?.orderNumber ?? orderId;
  const estimatedPayout = order?.estimatedPayout ?? 0;
  const pickupLocation = order ? getPickupLabel(order) : '';
  const deliveryAddress = order ? formatDeliveryAddress(order) : '';
  const customerLabel = formatCustomerPhone(order) || displayOrderId;
  const distanceToHub = getOrderDistanceLabel(order);
  const itemCount = order?.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0;

  const handleStartTravel = useCallback(() => {
    if (!orderId) return;
    invalidateActiveOrder(queryClient, orderId);
    router.replace({ pathname: '/travel-to-darkstore', params: { orderId } });
  }, [orderId, router, queryClient]);

  if (!orderId) {
    return (
      <SafeAreaView style={acceptedOrderStyles.container}>
        <Text variant="body">No order selected</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={acceptedOrderStyles.container} edges={['top', 'bottom']}>
      <Header title="Order Accepted" subtitle={`#${displayOrderId}`} onBack={() => router.back()} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: scale(16), gap: scale(16), paddingBottom: verticalScale(100) }}
      >
        {orderLoading ? (
          <ActivityIndicator size="large" color={Theme.colors.primaryMedium} />
        ) : (
          <>
            <View style={{ backgroundColor: Theme.colors.white, borderRadius: scale(12), padding: scale(16), gap: scale(8) }}>
              <Text variant="caption" color={Theme.colors.textGrey}>CUSTOMER</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
                <CustomerAvatarIcon size={scale(24)} color={Theme.colors.primaryMedium} />
                <View style={{ flex: 1 }}>
                  <Text variant="h3" color={Theme.colors.textDark}>{customerLabel}</Text>
                  <Text variant="bodySm" color={Theme.colors.textGrey} numberOfLines={2}>{deliveryAddress}</Text>
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: Theme.colors.white, borderRadius: scale(12), padding: scale(16), gap: scale(8) }}>
              <Text variant="caption" color={Theme.colors.textGrey}>DARKSTORE</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
                <HubStoreIcon size={scale(24)} color={Theme.colors.primaryMedium} />
                <View style={{ flex: 1 }}>
                  <Text variant="h3" color={Theme.colors.textDark}>{pickupLocation}</Text>
                  <Text variant="bodySm" color={Theme.colors.textGrey}>
                    {distanceToHub ? `Distance to darkstore: ${distanceToHub}` : 'Distance loading from order data'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: scale(12) }}>
              <View style={{ flex: 1, backgroundColor: Theme.colors.white, borderRadius: scale(12), padding: scale(16) }}>
                <Text variant="caption" color={Theme.colors.textGrey}>ITEMS</Text>
                <Text variant="h3" color={Theme.colors.textDark}>{itemCount}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: Theme.colors.white, borderRadius: scale(12), padding: scale(16) }}>
                <Text variant="caption" color={Theme.colors.textGrey}>EARNINGS</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(4) }}>
                  <RupeeIcon size={scale(16)} color={Theme.colors.primaryMedium} />
                  <Text variant="h3" color={Theme.colors.primaryMedium}>{estimatedPayout}</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={acceptedOrderStyles.bottomButtonContainer}>
        <TouchableOpacity
          style={[acceptedOrderStyles.callButton, { width: '100%', borderRadius: scale(12), height: scale(56), justifyContent: 'center', alignItems: 'center' }]}
          onPress={handleStartTravel}
          disabled={orderLoading}
        >
          <Text variant="body" color={Theme.colors.white} style={{ fontWeight: '700' }}>
            Travel to Darkstore
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

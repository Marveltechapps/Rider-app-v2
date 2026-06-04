/**
 * Step 6 — Handover order after OTP + photo verified.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryActionButton from '../components/common/PrimaryActionButton';
import Text from '../components/common/Text';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { deliverOrder } from '../api/orders';
import { useActiveOrder, invalidateActiveOrder } from '../hooks/useActiveOrder';
import handoverOrderStyles from '../styles/handoverOrderStyles';
import { formatCustomerPhone, formatDeliveryAddress, getOrderDistanceLabel } from '../utils/fleetMapCoords';
import { scale } from '../utils/responsive';
import { useQueryClient } from '@tanstack/react-query';

export default function HandoverOrderScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';
  const [delivering, setDelivering] = useState(false);

  const { order, isLoading } = useActiveOrder(orderId);

  const otpVerified = !!order?.metadata?.deliveryOtpVerifiedAt;
  const photoUploaded = !!order?.metadata?.deliveryProofPhotoUrl;
  const canHandover = otpVerified && photoUploaded;

  const handleHandover = useCallback(async () => {
    if (!orderId || !canHandover || delivering) return;
    setDelivering(true);
    try {
      const proofUrl = order?.metadata?.deliveryProofPhotoUrl;
      await deliverOrder(orderId, proofUrl ? { type: 'photo', value: proofUrl } : undefined);
      invalidateActiveOrder(queryClient, orderId);
      router.replace({
        pathname: '/delivery-complete',
        params: {
          orderId,
          estimatedPayout: String(order?.estimatedPayout ?? order?.pricing?.deliveryFee ?? 0),
          distance: getOrderDistanceLabel(order),
        },
      });
    } catch (e: unknown) {
      Alert.alert('Handover failed', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setDelivering(false);
    }
  }, [orderId, canHandover, delivering, order, router, queryClient]);

  if (isLoading) {
    return (
      <SafeAreaView style={handoverOrderStyles.container}>
        <ActivityIndicator color={Theme.colors.primaryMedium} />
      </SafeAreaView>
    );
  }

  if (!canHandover) {
    return (
      <SafeAreaView style={handoverOrderStyles.container} edges={['top', 'bottom']}>
        <Header title="Handover Order" onBack={() => router.back()} />
        <View style={{ padding: scale(16) }}>
          <Text variant="body" color={Theme.colors.textGrey}>
            Complete OTP verification and photo upload before handover.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={handoverOrderStyles.container} edges={['top', 'bottom']}>
      <Header title="Handover Order" subtitle="Delivery verified" onBack={() => router.back()} />

      <View style={{ padding: scale(16), gap: scale(20), flex: 1 }}>
        <View style={{ alignItems: 'center', gap: scale(12), paddingVertical: scale(24) }}>
          <CheckCircleIcon size={scale(56)} color={Theme.colors.primaryMedium} />
          <Text variant="h2" color={Theme.colors.textDark}>Delivery Verified</Text>
          <Text variant="bodySm" color={Theme.colors.textGrey} style={{ textAlign: 'center' }}>
            OTP and delivery photo confirmed for order {order?.orderNumber}
          </Text>
        </View>

        <View style={handoverOrderStyles.customerCard}>
          <View style={handoverOrderStyles.customerInfo}>
            <Text variant="h3" color="#101828">{formatCustomerPhone(order) || order?.orderNumber}</Text>
            <Text variant="bodySm" color="#6A7282" numberOfLines={2}>
              {formatDeliveryAddress(order)}
            </Text>
          </View>
        </View>
      </View>

      <View style={handoverOrderStyles.bottomButtonContainer}>
        <PrimaryActionButton
          label={delivering ? 'Completing…' : 'Hand Over Order'}
          onPress={handleHandover}
          disabled={delivering}
          loading={delivering}
        />
      </View>
    </SafeAreaView>
  );
}

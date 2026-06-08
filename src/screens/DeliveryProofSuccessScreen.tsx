/**
 * Shown after delivery photo is uploaded to S3 — confirms proof saved before handover.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { useActiveOrder } from '../hooks/useActiveOrder';
import handoverOrderStyles from '../styles/handoverOrderStyles';
import { scale } from '../utils/responsive';

export default function DeliveryProofSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string; photoUrl?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';
  const photoUrlParam = Array.isArray(params.photoUrl) ? params.photoUrl[0] : params.photoUrl;

  const { order } = useActiveOrder(orderId);
  const photoUrl = photoUrlParam || order?.metadata?.deliveryProofPhotoUrl || null;

  const handleContinueHandover = useCallback(() => {
    if (!orderId) return;
    router.replace({ pathname: '/handover-order', params: { orderId } });
  }, [orderId, router]);

  return (
    <SafeAreaView style={handoverOrderStyles.container} edges={['top', 'bottom']}>
      <Header title="Photo Saved" subtitle="Delivery proof recorded" onBack={() => router.back()} />

      <View style={{ flex: 1, padding: scale(16), gap: scale(20), alignItems: 'center' }}>
        <View
          style={{
            width: scale(72),
            height: scale(72),
            borderRadius: scale(36),
            backgroundColor: 'rgba(35, 114, 39, 0.12)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CheckCircleIcon size={scale(40)} color={Theme.colors.primaryMedium} />
        </View>

        <View style={{ alignItems: 'center', gap: scale(8) }}>
          <Text variant="h2" color="#101828" style={{ textAlign: 'center' }}>
            Delivery Photo Saved
          </Text>
          <Text variant="bodySm" color="#6A7282" style={{ textAlign: 'center', paddingHorizontal: scale(12) }}>
            Your delivery proof has been uploaded to secure cloud storage (AWS S3) and linked to order{' '}
            {order?.orderNumber || orderId}.
          </Text>
        </View>

        {photoUrl ? (
          <View style={{ width: '100%', alignItems: 'center', gap: scale(8) }}>
            <Image
              source={{ uri: photoUrl }}
              style={[
                handoverOrderStyles.deliveryProofPhoto,
                { width: scale(200), height: scale(150), borderRadius: scale(12) },
              ]}
              resizeMode="cover"
            />
            <Text variant="caption" color="#6A7282" numberOfLines={2} style={{ textAlign: 'center' }}>
              Stored securely — required for handover
            </Text>
          </View>
        ) : null}

        <View
          style={{
            width: '100%',
            padding: scale(12),
            backgroundColor: 'rgba(35, 114, 39, 0.08)',
            borderRadius: scale(10),
            borderWidth: 1,
            borderColor: 'rgba(35, 114, 39, 0.2)',
          }}
        >
          <Text variant="bodySm" color="#237227" style={{ textAlign: 'center' }}>
            OTP verified · Photo uploaded · Ready for handover
          </Text>
        </View>
      </View>

      <View style={[handoverOrderStyles.otpScreenFooter, { paddingBottom: scale(20) }]}>
        <TouchableOpacity
          style={handoverOrderStyles.otpPrimaryActionButton}
          onPress={handleContinueHandover}
          activeOpacity={0.85}
        >
          <Text variant="body" color={Theme.colors.white} style={{ fontWeight: '700' }}>
            Continue to Handover
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

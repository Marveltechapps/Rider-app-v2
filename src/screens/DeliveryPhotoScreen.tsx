/**
 * Delivery photo upload (S3) then mark order delivered → success screen.
 */

import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import Text from '../components/common/Text';
import CameraIcon from '../components/icons/CameraIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { deliverOrder, uploadDeliveryProofPhoto } from '../api/orders';
import { invalidateActiveOrder, useActiveOrder } from '../hooks/useActiveOrder';
import handoverOrderStyles from '../styles/handoverOrderStyles';
import { getOrderDistanceLabel } from '../utils/fleetMapCoords';
import { scale } from '../utils/responsive';

export default function DeliveryPhotoScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [completing, setCompleting] = useState(false);

  const { order } = useActiveOrder(orderId);

  useEffect(() => {
    if (order?.status?.toLowerCase() === 'delivered' && orderId) {
      router.replace({
        pathname: '/delivery-complete',
        params: {
          orderId,
          estimatedPayout: String(order?.estimatedPayout ?? order?.pricing?.deliveryFee ?? 0),
          distance: getOrderDistanceLabel(order),
        },
      });
    }
  }, [order?.status, orderId, order, router]);

  useEffect(() => {
    if (order?.metadata?.deliveryProofPhotoUrl) {
      setUploadedUrl(order.metadata.deliveryProofPhotoUrl);
    }
  }, [order?.metadata?.deliveryProofPhotoUrl]);

  const navigateToDeliveryComplete = useCallback(
    (proofUrl: string) => {
      if (!orderId) return;
      router.replace({
        pathname: '/delivery-complete',
        params: {
          orderId,
          estimatedPayout: String(order?.estimatedPayout ?? order?.pricing?.deliveryFee ?? 0),
          distance: getOrderDistanceLabel(order),
        },
      });
    },
    [orderId, order, router]
  );

  const handleTakePhoto = useCallback(async () => {
    if (!orderId) return;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission required', 'Allow camera access to capture delivery proof.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    setUploadedUrl(null);
    setUploadedKey(null);
    setUploading(true);
    try {
      const res = await uploadDeliveryProofPhoto(orderId, {
        uri,
        name: 'delivery-proof.jpg',
        type: 'image/jpeg',
      });
      if (!res.url) {
        throw new Error('Upload did not return a photo URL');
      }
      setUploadedUrl(res.url);
      setUploadedKey(res.key ?? null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Please try again.';
      Alert.alert('Upload failed', message);
      setPhotoUri(null);
      setUploadedUrl(null);
      setUploadedKey(null);
    } finally {
      setUploading(false);
    }
  }, [orderId]);

  const handleCompleteDelivery = useCallback(async () => {
    const proofUrl = uploadedUrl;
    if (!proofUrl || !orderId || completing) return;

    setCompleting(true);
    try {
      await deliverOrder(orderId, { type: 'photo', value: proofUrl });
      invalidateActiveOrder(queryClient, orderId);
      navigateToDeliveryComplete(proofUrl);
    } catch (e: unknown) {
      Alert.alert('Could not complete delivery', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setCompleting(false);
    }
  }, [uploadedUrl, orderId, completing, queryClient, navigateToDeliveryComplete]);

  const previewUri = photoUri || uploadedUrl;
  const busy = uploading || completing;

  return (
    <SafeAreaView style={handoverOrderStyles.container} edges={['top']}>
      <Header title="Delivery Photo" subtitle="Capture proof of delivery" onBack={() => router.back()} />

      <View style={{ padding: scale(16), flex: 1, gap: scale(16) }}>
        <Text variant="bodySm" color={Theme.colors.textGrey}>
          Take a photo of the delivered package. It is saved to AWS S3, then the order is marked delivered.
        </Text>

        <TouchableOpacity
          style={[handoverOrderStyles.deliveryProofCard, previewUri && handoverOrderStyles.deliveryProofCardWithPhoto]}
          onPress={handleTakePhoto}
          disabled={busy}
          activeOpacity={0.85}
        >
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={handoverOrderStyles.deliveryProofPhoto} resizeMode="cover" />
          ) : (
            <View style={handoverOrderStyles.deliveryProofIcon}>
              <CameraIcon size={scale(28)} color="#6A7282" />
            </View>
          )}
          <Text variant="bodySm" color="#6A7282" style={handoverOrderStyles.deliveryProofText}>
            {uploading ? 'Uploading to cloud…' : uploadedUrl ? 'Photo saved — tap to retake' : 'Tap to open camera'}
          </Text>
          {uploading ? <ActivityIndicator color={Theme.colors.primaryMedium} /> : null}
        </TouchableOpacity>

        {uploadedUrl ? (
          <View
            style={{
              padding: scale(12),
              backgroundColor: 'rgba(50, 201, 106, 0.08)',
              borderRadius: scale(10),
              borderWidth: 1,
              borderColor: 'rgba(50, 201, 106, 0.25)',
              gap: scale(4),
            }}
          >
            <Text variant="bodySm" color="#32C96A" style={{ fontWeight: '700' }}>
              Uploaded to AWS S3
            </Text>
            <Text variant="caption" color="#6A7282" numberOfLines={2}>
              {uploadedKey ? `File: ${uploadedKey}` : 'Delivery proof linked to this order'}
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={[
          handoverOrderStyles.otpScreenFooter,
          { paddingBottom: Math.max(insets.bottom, scale(12)) },
        ]}
      >
        <TouchableOpacity
          style={[
            handoverOrderStyles.otpPrimaryActionButton,
            { opacity: uploadedUrl && !busy ? 1 : 0.5 },
          ]}
          onPress={handleCompleteDelivery}
          disabled={!uploadedUrl || busy}
          activeOpacity={0.85}
        >
          {completing ? (
            <ActivityIndicator color={Theme.colors.white} />
          ) : (
            <Text variant="body" color={Theme.colors.white} style={{ fontWeight: '700' }}>
              Complete Delivery
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

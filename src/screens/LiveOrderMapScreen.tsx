/**
 * Live Order Map Screen — between hub arrival swipe and verify hub items.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderLiveMapView from '../components/features/OrderLiveMapView';
import PrimaryActionButton from '../components/common/PrimaryActionButton';
import Text from '../components/common/Text';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import LocationIcon from '../components/icons/LocationIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import { useActiveOrder } from '../hooks/useActiveOrder';
import { useOrderMapData } from '../hooks/useOrderMapData';
import acceptedOrderStyles from '../styles/acceptedOrderStyles';
import { iconButtonStyles } from '../styles/iconButtonStyles';
import { scale } from '../utils/responsive';
import { getOrderDistanceLabel } from '../utils/fleetMapCoords';

export default function LiveOrderMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    pickupLocation?: string;
    pickupBay?: string;
    deliveryLocation?: string;
    estimatedPayout?: string;
    items?: string;
  }>();

  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';
  const { order, isLoading } = useActiveOrder(orderId);

  const {
    riderLocation,
    pickupCoords,
    dropCoords,
    routeCoords,
    etaMinutes,
    deliveryAddress,
    pickupLabel,
    fitCoordinates,
  } = useOrderMapData(order, 'hub_to_drop');

  const displayOrderId = order?.orderNumber ?? orderId;
  const distanceLabel = getOrderDistanceLabel(order);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleCenterOnUser = useCallback(() => {
    // fit handled by map component via fitCoordinates updates
  }, []);

  const handleOpenNavigation = useCallback(() => {
    const dest = dropCoords;
    if (dest) {
      const url =
        Platform.OS === 'ios'
          ? `maps://app?daddr=${dest.latitude},${dest.longitude}&dirflg=d`
          : `https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}`;
      Linking.openURL(url).catch(() => {
        if (deliveryAddress) {
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deliveryAddress)}`);
        }
      });
    } else if (deliveryAddress) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deliveryAddress)}`);
    }
  }, [dropCoords, deliveryAddress]);

  const handleContinue = useCallback(() => {
    router.push({ pathname: '/verify-hub-items', params: { orderId } });
  }, [router, orderId]);

  return (
    <SafeAreaView style={acceptedOrderStyles.container} edges={['top', 'bottom']}>
      <View style={acceptedOrderStyles.mapContainer}>
        <OrderLiveMapView
          riderLocation={riderLocation}
          pickupCoords={pickupCoords}
          dropCoords={dropCoords}
          routeCoords={routeCoords}
          fitCoordinates={fitCoordinates}
          pickupLabel={pickupLabel}
          deliveryAddress={deliveryAddress}
          showPickup
          showDrop
          showRider
        />

        <View style={acceptedOrderStyles.mapOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={[acceptedOrderStyles.topBackButton, iconButtonStyles.light]}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <BackArrowIcon size={scale(26)} color={Theme.colors.textDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={acceptedOrderStyles.locationButton}
            onPress={handleCenterOnUser}
            activeOpacity={0.8}
          >
            <LocationIcon size={scale(17.5)} color={Theme.colors.primaryMedium} />
          </TouchableOpacity>

          <View style={acceptedOrderStyles.etaBadge}>
            <Text variant="caption" color={Theme.colors.textGrey} style={acceptedOrderStyles.etaLabel}>
              ETA
            </Text>
            <Text variant="body" color={Theme.colors.textDark} style={acceptedOrderStyles.etaTime}>
              {etaMinutes} mins
            </Text>
            <Text variant="caption" color={Theme.colors.textGrey}>
              {distanceLabel}
            </Text>
          </View>
        </View>
      </View>

      <View style={[acceptedOrderStyles.bottomSheet, { position: 'relative', flex: 0, height: undefined, padding: scale(16) }]}>
        <Header
          title="Live Route"
          subtitle={`Order ${displayOrderId}`}
          showBackButton={false}
        />
        <View style={{ marginTop: scale(8), gap: scale(6) }}>
          <Text variant="caption" color={Theme.colors.textGrey}>
            PICKUP
          </Text>
          <Text variant="bodySm" color={Theme.colors.textDark}>
            {pickupLabel}
          </Text>
          <Text variant="caption" color={Theme.colors.textGrey} style={{ marginTop: scale(8) }}>
            DELIVERY
          </Text>
          <Text variant="bodySm" color={Theme.colors.textDark}>
            {isLoading ? 'Loading address…' : deliveryAddress}
          </Text>
        </View>
        <TouchableOpacity style={[iconButtonStyles.primary, { alignSelf: 'flex-end', marginTop: scale(12) }]} onPress={handleOpenNavigation}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' }}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={acceptedOrderStyles.bottomButtonContainer}>
        <PrimaryActionButton label="Verify Items" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

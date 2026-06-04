/**
 * Step 2 — Travel to darkstore (live GPS navigation to hub).
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import PrimaryActionButton from '../components/common/PrimaryActionButton';
import Text from '../components/common/Text';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import LocationIcon from '../components/icons/LocationIcon';
import HubStoreIcon from '../components/icons/HubStoreIcon';
import OrderLiveMapView from '../components/features/OrderLiveMapView';
import { Theme } from '../constants/Theme';
import { arrivedAtDarkstore } from '../api/orders';
import { useActiveOrder, invalidateActiveOrder } from '../hooks/useActiveOrder';
import { useOrderMapData } from '../hooks/useOrderMapData';
import acceptedOrderStyles from '../styles/acceptedOrderStyles';
import travelNavigationStyles from '../styles/travelNavigationStyles';
import { iconButtonStyles } from '../styles/iconButtonStyles';
import {
  distanceMeters,
  formatRouteDistanceLabel,
  getOrderDistanceLabel,
  getPickupGeocodeQuery,
  getPickupLabel,
} from '../utils/fleetMapCoords';
import { openDrivingDirections } from '../utils/navigationLinks';
import { scale } from '../utils/responsive';

const MAP_FOOTER_PADDING = scale(200);
/** Rider must be within this radius of darkstore to confirm arrival. */
const ARRIVED_AT_DARKSTORE_RADIUS_M = 30;

export default function TravelToDarkstoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';
  const [submitting, setSubmitting] = useState(false);
  const [recenterTick, setRecenterTick] = useState(0);
  const [showArrivalTooltip, setShowArrivalTooltip] = useState(false);
  const arrivalTooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { order, isLoading } = useActiveOrder(orderId);
  const {
    riderLocation,
    pickupCoords,
    routeCoords,
    etaMinutes,
    routeDistanceMeters,
    pickupLabel,
    fitCoordinates,
    locationReady,
    isRouting,
    darkstoreUsesCurrentLocation,
  } = useOrderMapData(order, 'to_hub');

  const storeName = getPickupLabel(order);
  const storeAddress =
    (typeof order?.metadata?.pickupAddress === 'string' && order.metadata.pickupAddress !== storeName
      ? order.metadata.pickupAddress
      : null) || storeName;
  const fallbackDistance = getOrderDistanceLabel(order);
  const liveDistance = formatRouteDistanceLabel(routeDistanceMeters) || fallbackDistance;

  const distanceToDarkstoreM = useMemo(() => {
    if (!riderLocation || !pickupCoords) return null;
    return distanceMeters(riderLocation, pickupCoords);
  }, [riderLocation, pickupCoords]);

  const canConfirmArrival = useMemo(
    () =>
      locationReady &&
      !!pickupCoords &&
      distanceToDarkstoreM != null &&
      distanceToDarkstoreM <= ARRIVED_AT_DARKSTORE_RADIUS_M,
    [locationReady, pickupCoords, distanceToDarkstoreM]
  );

  const arrivalHint = useMemo(() => {
    if (canConfirmArrival) return null;
    if (!locationReady) return 'Waiting for GPS…';
    if (!pickupCoords) return 'Loading darkstore location…';
    if (distanceToDarkstoreM == null) {
      return `Move within ${ARRIVED_AT_DARKSTORE_RADIUS_M} m of the darkstore to confirm arrival`;
    }
    const away = formatRouteDistanceLabel(distanceToDarkstoreM) || `${Math.round(distanceToDarkstoreM)} m`;
    return `${away} away - move within ${ARRIVED_AT_DARKSTORE_RADIUS_M} m to enable arrival`;
  }, [canConfirmArrival, locationReady, pickupCoords, distanceToDarkstoreM]);

  const showArrivalTooltipMessage = useCallback(() => {
    if (!arrivalHint) return;
    setShowArrivalTooltip(true);
    if (arrivalTooltipTimerRef.current) clearTimeout(arrivalTooltipTimerRef.current);
    arrivalTooltipTimerRef.current = setTimeout(() => setShowArrivalTooltip(false), 4000);
  }, [arrivalHint]);

  useEffect(() => {
    if (canConfirmArrival) setShowArrivalTooltip(false);
  }, [canConfirmArrival]);

  useEffect(
    () => () => {
      if (arrivalTooltipTimerRef.current) clearTimeout(arrivalTooltipTimerRef.current);
    },
    []
  );

  const handleBack = useCallback(() => router.back(), [router]);

  const handleCenterOnRider = useCallback(() => {
    setRecenterTick((n) => n + 1);
  }, []);

  const handleStartNavigation = useCallback(() => {
    if (pickupCoords) {
      openDrivingDirections(riderLocation, pickupCoords, getPickupGeocodeQuery(order) || storeName);
      return;
    }
    const query = getPickupGeocodeQuery(order);
    if (query) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`).catch(
        console.warn
      );
    }
  }, [pickupCoords, riderLocation, order, storeName]);

  const handleArrived = useCallback(async () => {
    if (!orderId || submitting || !canConfirmArrival) return;
    setSubmitting(true);
    try {
      await arrivedAtDarkstore(orderId);
      invalidateActiveOrder(queryClient, orderId);
      router.push({ pathname: '/collect-bag', params: { orderId } });
    } catch (e) {
      console.error('Arrived at darkstore failed:', e);
    } finally {
      setSubmitting(false);
    }
  }, [orderId, submitting, canConfirmArrival, router, queryClient]);

  if (!orderId) {
    return (
      <SafeAreaView style={travelNavigationStyles.root}>
        <Text variant="body">No order selected</Text>
      </SafeAreaView>
    );
  }

  const journeyStatus = !locationReady
    ? 'Getting your location…'
    : !pickupCoords
      ? 'Loading darkstore location…'
      : isRouting
        ? 'Updating route…'
        : `Head to ${storeName}`;

  return (
    <SafeAreaView style={travelNavigationStyles.root} edges={['top']}>
      <View style={{ flex: 1 }}>
      <View style={travelNavigationStyles.mapSection}>
        <OrderLiveMapView
          riderLocation={riderLocation}
          pickupCoords={pickupCoords}
          dropCoords={null}
          routeCoords={routeCoords}
          fitCoordinates={fitCoordinates}
          pickupLabel={pickupLabel}
          showPickup
          showDrop={false}
          showRider={false}
          navigationMode
          mapPaddingBottom={MAP_FOOTER_PADDING}
          recenterTick={recenterTick}
          recenterCoordinate={riderLocation}
        />

        <View style={travelNavigationStyles.mapOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={[acceptedOrderStyles.topBackButton, iconButtonStyles.light]}
            onPress={handleBack}
          >
            <BackArrowIcon size={scale(26)} color={Theme.colors.textDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={acceptedOrderStyles.locationButton}
            onPress={handleCenterOnRider}
            activeOpacity={0.8}
          >
            <LocationIcon size={scale(17.5)} color={Theme.colors.primaryMedium} />
          </TouchableOpacity>

          <View style={acceptedOrderStyles.etaBadge}>
            <Text variant="caption" color={Theme.colors.textGrey}>
              ETA to darkstore
            </Text>
            <Text variant="body" color={Theme.colors.textDark}>
              {etaMinutes} mins
            </Text>
            {liveDistance ? (
              <Text variant="caption" color={Theme.colors.textGrey}>
                {liveDistance}
              </Text>
            ) : null}
          </View>

          <View style={travelNavigationStyles.journeyBanner} pointerEvents="none">
            <Text variant="caption" color={Theme.colors.primaryMedium} style={{ fontWeight: '700' }}>
              LIVE NAVIGATION
            </Text>
            <Text variant="body" color={Theme.colors.textDark} style={{ fontWeight: '600' }}>
              {darkstoreUsesCurrentLocation ? 'Darkstore set to your current location' : journeyStatus}
            </Text>
            <View style={travelNavigationStyles.journeyRouteRow}>
              <View style={[travelNavigationStyles.journeyDot, { backgroundColor: '#2196F3' }]} />
              <Text variant="caption" color={Theme.colors.textGrey} numberOfLines={1} style={{ flex: 1 }}>
                Your location
              </Text>
              <View style={travelNavigationStyles.journeyLine} />
              <View
                style={[travelNavigationStyles.journeyDot, { backgroundColor: Theme.colors.primaryMedium }]}
              />
              <Text variant="caption" color={Theme.colors.textDark} numberOfLines={1} style={{ flex: 1 }}>
                {storeName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={travelNavigationStyles.footer}>
        <View style={travelNavigationStyles.destinationCard}>
          <Text variant="caption" color={Theme.colors.textGrey} style={{ marginBottom: scale(8) }}>
            DESTINATION — DARKSTORE
          </Text>
          <View style={travelNavigationStyles.destinationRow}>
            <HubStoreIcon size={scale(32)} color={Theme.colors.primaryMedium} />
            <View style={travelNavigationStyles.destinationInfo}>
              <Text variant="h3" color={Theme.colors.textDark}>
                {isLoading ? 'Loading…' : storeName}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey} numberOfLines={3}>
                {storeAddress}
              </Text>
              <Text variant="caption" color={Theme.colors.textGrey} style={{ marginTop: scale(4) }}>
                Order {order?.orderNumber || orderId}
                {liveDistance ? ` · ${liveDistance} away` : ''}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={travelNavigationStyles.navigateButton}
          onPress={handleStartNavigation}
          activeOpacity={0.85}
          disabled={!pickupCoords && !getPickupGeocodeQuery(order)}
        >
          <Text variant="body" color={Theme.colors.white} style={{ fontWeight: '700' }}>
            Start in Google Maps
          </Text>
        </TouchableOpacity>

        <View
          style={[
            travelNavigationStyles.arrivalActionSection,
            { paddingBottom: Math.max(scale(16), insets.bottom) },
          ]}
        >
          <View style={travelNavigationStyles.arrivalActionWrap}>
            {showArrivalTooltip && arrivalHint ? (
              <View style={travelNavigationStyles.arrivalTooltip}>
                <Text variant="caption" style={travelNavigationStyles.arrivalTooltipText}>
                  {arrivalHint}
                </Text>
              </View>
            ) : null}
            <PrimaryActionButton
              label="Arrived at Darkstore"
              style={travelNavigationStyles.arrivalPrimaryButton}
              onPress={() => {
                if (canConfirmArrival) {
                  void handleArrived();
                } else {
                  showArrivalTooltipMessage();
                }
              }}
              disabled={submitting}
              loading={submitting}
            />
          </View>
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
}

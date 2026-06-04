/**
 * Step 4 — Customer navigation (rider → customer, live GPS like Travel to Darkstore).
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import PrimaryActionButton from '../components/common/PrimaryActionButton';
import Text from '../components/common/Text';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import CallIcon from '../components/icons/CallIcon';
import CustomerAvatarIcon from '../components/icons/CustomerAvatarIcon';
import LocationIcon from '../components/icons/LocationIcon';
import OrderLiveMapView from '../components/features/OrderLiveMapView';
import { Theme } from '../constants/Theme';
import { arrivedAtCustomer } from '../api/orders';
import { useActiveOrder, invalidateActiveOrder } from '../hooks/useActiveOrder';
import { useOrderMapData } from '../hooks/useOrderMapData';
import acceptedOrderStyles from '../styles/acceptedOrderStyles';
import travelNavigationStyles from '../styles/travelNavigationStyles';
import { iconButtonStyles } from '../styles/iconButtonStyles';
import {
  distanceMeters,
  formatCustomerPhone,
  getCustomerPhoneDigits,
  formatDeliveryAddress,
  formatRouteDistanceLabel,
  getDropGeocodeQuery,
  getOrderDistanceLabel,
} from '../utils/fleetMapCoords';
import { openDrivingDirections } from '../utils/navigationLinks';
import { scale } from '../utils/responsive';

const MAP_FOOTER_PADDING = scale(200);
/** Rider must be within this radius of the customer to confirm arrival. */
const REACHED_CUSTOMER_RADIUS_M = 30;

export default function CustomerNavigationScreen() {
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
    dropCoords,
    routeCoords,
    etaMinutes,
    routeDistanceMeters,
    deliveryAddress,
    fitCoordinates,
    locationReady,
    isRouting,
  } = useOrderMapData(order, 'to_drop');

  const customerPhone = order?.customerPhoneNumber?.replace(/\D/g, '') || '';
  const customerLabel = formatCustomerPhone(order) || order?.orderNumber || orderId;
  const customerAddress = deliveryAddress || formatDeliveryAddress(order);
  const fallbackDistance = getOrderDistanceLabel(order);
  const liveDistance = formatRouteDistanceLabel(routeDistanceMeters) || fallbackDistance;

  const distanceToCustomerM = useMemo(() => {
    if (!riderLocation || !dropCoords) return null;
    return distanceMeters(riderLocation, dropCoords);
  }, [riderLocation, dropCoords]);

  const canConfirmArrival = useMemo(
    () =>
      locationReady &&
      !!dropCoords &&
      distanceToCustomerM != null &&
      distanceToCustomerM <= REACHED_CUSTOMER_RADIUS_M,
    [locationReady, dropCoords, distanceToCustomerM]
  );

  const arrivalHint = useMemo(() => {
    if (canConfirmArrival) return null;
    if (!locationReady) return 'Waiting for GPS…';
    if (!dropCoords) return 'Loading customer location…';
    if (distanceToCustomerM == null) {
      return `Move within ${REACHED_CUSTOMER_RADIUS_M} m of the customer to confirm arrival`;
    }
    const away = formatRouteDistanceLabel(distanceToCustomerM) || `${Math.round(distanceToCustomerM)} m`;
    return `${away} away - move within ${REACHED_CUSTOMER_RADIUS_M} m to enable arrival`;
  }, [canConfirmArrival, locationReady, dropCoords, distanceToCustomerM]);

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

  const handleCall = useCallback(() => {
    if (customerPhone) Linking.openURL(`tel:${customerPhone}`).catch(console.warn);
  }, [customerPhone]);

  const handleStartNavigation = useCallback(() => {
    if (dropCoords) {
      openDrivingDirections(riderLocation, dropCoords, getDropGeocodeQuery(order) || customerAddress);
      return;
    }
    const query = getDropGeocodeQuery(order);
    if (query) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`).catch(
        console.warn
      );
    }
  }, [dropCoords, riderLocation, order, customerAddress]);

  const handleReachedCustomer = useCallback(async () => {
    if (!orderId || submitting || !canConfirmArrival) return;
    const phoneDigits = getCustomerPhoneDigits(order);
    if (!phoneDigits) {
      Alert.alert(
        'Customer phone missing',
        'This order has no valid customer mobile number. Contact support before verifying delivery.'
      );
      return;
    }
    setSubmitting(true);
    try {
      await arrivedAtCustomer(orderId);
      invalidateActiveOrder(queryClient, orderId);
      router.push({
        pathname: '/customer-otp-verification',
        params: {
          orderId,
          phoneNumber: formatCustomerPhone(order) || `+91 ${phoneDigits}`,
        },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Please try again.';
      Alert.alert('Unable to confirm arrival', message);
      console.error('Reached customer failed:', e);
    } finally {
      setSubmitting(false);
    }
  }, [orderId, submitting, canConfirmArrival, router, queryClient, order]);

  if (!orderId) {
    return (
      <SafeAreaView style={travelNavigationStyles.root}>
        <Text variant="body">No order selected</Text>
      </SafeAreaView>
    );
  }

  const journeyStatus = !locationReady
    ? 'Getting your location…'
    : !dropCoords
      ? 'Loading customer location…'
      : isRouting
        ? 'Updating route…'
        : `Head to ${customerLabel}`;

  return (
    <SafeAreaView style={travelNavigationStyles.root} edges={['top']}>
      <View style={{ flex: 1 }}>
        <View style={travelNavigationStyles.mapSection}>
          <OrderLiveMapView
            riderLocation={riderLocation}
            pickupCoords={null}
            dropCoords={dropCoords}
            routeCoords={routeCoords}
            fitCoordinates={fitCoordinates}
            deliveryAddress={customerAddress}
            showPickup={false}
            showDrop
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
                ETA to customer
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
                {journeyStatus}
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
                  {customerLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={travelNavigationStyles.footer}>
          <View style={travelNavigationStyles.destinationCard}>
            <Text variant="caption" color={Theme.colors.textGrey} style={{ marginBottom: scale(8) }}>
              DESTINATION — CUSTOMER
            </Text>
            <View style={travelNavigationStyles.destinationRow}>
              <CustomerAvatarIcon size={scale(32)} color={Theme.colors.primaryMedium} />
              <View style={travelNavigationStyles.destinationInfo}>
                <Text variant="h3" color={Theme.colors.textDark}>
                  {isLoading ? 'Loading…' : customerLabel}
                </Text>
                <Text variant="bodySm" color={Theme.colors.textGrey} numberOfLines={3}>
                  {customerAddress || 'Address unavailable'}
                </Text>
                <Text variant="caption" color={Theme.colors.textGrey} style={{ marginTop: scale(4) }}>
                  Order {order?.orderNumber || orderId}
                  {liveDistance ? ` · ${liveDistance} away` : ''}
                </Text>
              </View>
              {customerPhone ? (
                <View style={travelNavigationStyles.destinationActions}>
                  <TouchableOpacity
                    style={travelNavigationStyles.destinationCallButton}
                    onPress={handleCall}
                    activeOpacity={0.85}
                    accessibilityLabel="Call customer"
                  >
                    <View style={travelNavigationStyles.destinationCallIconInner}>
                      <CallIcon size={scale(24)} color={Theme.colors.white} />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            style={travelNavigationStyles.navigateButton}
            onPress={handleStartNavigation}
            activeOpacity={0.85}
            disabled={!dropCoords && !getDropGeocodeQuery(order)}
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
                label="Reached Customer"
                style={travelNavigationStyles.arrivalPrimaryButton}
                onPress={() => {
                  if (canConfirmArrival) {
                    void handleReachedCustomer();
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

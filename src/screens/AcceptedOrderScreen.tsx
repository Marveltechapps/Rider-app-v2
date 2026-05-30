/**
 * Accepted Order Screen Component
 * Screen shown after rider accepts an order – real map, route, ETA, functional buttons
 */

import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import SwipeToAccept from '../components/SwipeToAccept';
import Text from '../components/common/Text';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import LocationIcon from '../components/icons/LocationIcon';
import CallIcon from '../components/icons/CallIcon';
import HubStoreIcon from '../components/icons/HubStoreIcon';
import CustomerAvatarIcon from '../components/icons/CustomerAvatarIcon';
import { Theme } from '../constants/Theme';
import acceptedOrderStyles from '../styles/acceptedOrderStyles';
import { scale, verticalScale } from '../utils/responsive';
import { getOrder, type BackendOrder } from '../api/orders';
import { geocodeAddress } from '../utils/location';
import { fetchDirections } from '../utils/directions';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CHENNAI_CENTER = { latitude: 13.0827, longitude: 80.2707 };
const MAP_DELTA = { latitudeDelta: 0.03, longitudeDelta: 0.03 };
const SHEET_COLLAPSED = verticalScale(220);
const SHEET_EXPANDED = SCREEN_HEIGHT * 0.7;

interface AcceptedOrderScreenProps {
  orderId?: string;
  estimatedPayout?: string;
  pickupLocation?: string;
  pickupBay?: string;
  deliveryLocation?: string;
  distance?: string;
  time?: string;
  items?: string;
}

export default function AcceptedOrderScreen({
  orderId: paramOrderId,
  estimatedPayout: paramPayout,
  pickupLocation: paramPickupLocation,
  pickupBay: paramPickupBay,
  deliveryLocation: paramDeliveryLocation,
  distance: paramDistance,
  time: paramTime,
  items: paramItems,
}: AcceptedOrderScreenProps) {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(true);

  const [riderLocation, setRiderLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hubCoords, setHubCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hubAddress, setHubAddress] = useState<string | null>(null);
  const [customerCoords, setCustomerCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [etaMinutes, setEtaMinutes] = useState<number>(5);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const sheetAnim = useRef(new Animated.Value(SHEET_COLLAPSED)).current;

  const orderId = paramOrderId ?? '';

  const { data: orderRes, isLoading: orderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId && orderId.length > 10,
  });

  const order: BackendOrder | undefined = orderRes?.order;

  const displayOrderId = order?.orderNumber ?? orderId ?? '—';
  const estimatedPayout = order?.estimatedPayout ?? (paramPayout ? parseFloat(paramPayout) : 0);
  const pickupLocation = order
    ? (order.darkstoreCode || order.warehouseCode)
      ? `Darkstore ${order.darkstoreCode || order.warehouseCode}`
      : 'Hub'
    : paramPickupLocation ?? 'Hub';
  const pickupBay = paramPickupBay ?? '';
  const deliveryAddress = order?.delivery?.address;
  const deliveryLocation =
    (deliveryAddress &&
      [deliveryAddress.addressLine1, deliveryAddress.city, deliveryAddress.pincode]
        .filter((s) => s && s !== 'NA')
        .join(', ')) ||
    (paramDeliveryLocation ?? '—');
  const orderItems = order?.items ?? [];
  const itemCount = orderItems.reduce((s, i) => s + (i.quantity || 0), 0) || (paramItems ? parseInt(paramItems, 10) : 0);
  const customerPhone = order?.customerPhoneNumber?.replace(/\D/g, '') || '';

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let watchId: Location.LocationSubscription | null = null;
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        // Get initial position
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (isMountedRef.current && !cancelled) {
          setRiderLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }

        // Start watching position for live updates
        watchId = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 2000,
            distanceInterval: 1,
          },
          (newLoc) => {
            if (isMountedRef.current && !cancelled) {
              setRiderLocation({
                latitude: newLoc.coords.latitude,
                longitude: newLoc.coords.longitude,
              });
            }
          }
        );
      } catch (e) {
        console.warn('Location error:', e);
      }
    })();
    return () => {
      cancelled = true;
      if (watchId) watchId.remove();
    };
  }, []);

  useEffect(() => {
    if (!order || !pickupLocation) return;
    let cancelled = false;
    
    // Search for the Hub/Darkstore by name
    const city = deliveryAddress?.city || 'Chennai';
    const addr = `${pickupLocation}, ${city}`;
    
    geocodeAddress(addr).then((res) => {
      if (res && isMountedRef.current && !cancelled) {
        setHubCoords({ latitude: res.latitude, longitude: res.longitude });
        setHubAddress(res.formattedAddress);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [order?.darkstoreCode, order?.warehouseCode, pickupLocation, deliveryAddress?.city]);

  useEffect(() => {
    const backendCoords = deliveryAddress?.coordinates;
    if (backendCoords?.lat != null && backendCoords?.lng != null) {
      setCustomerCoords({ latitude: backendCoords.lat, longitude: backendCoords.lng });
      return;
    }

    if (!deliveryLocation || deliveryLocation === '—') return;
    let cancelled = false;
    geocodeAddress(deliveryLocation).then((res) => {
      if (res && isMountedRef.current && !cancelled) {
        setCustomerCoords({ latitude: res.latitude, longitude: res.longitude });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [deliveryLocation, deliveryAddress?.coordinates?.lat, deliveryAddress?.coordinates?.lng]);

  useEffect(() => {
    if (!riderLocation || !hubCoords) return;
    let cancelled = false;

    // Fetch directions whenever rider moves or hub changes
    fetchDirections(riderLocation, hubCoords).then((result) => {
      if (result && isMountedRef.current && !cancelled) {
        setRouteCoords(result.coordinates);
        setEtaMinutes(result.durationMinutes);
        
        // Auto-fit the map to show the entire route
        // We do this whenever the route is updated significantly
        if (mapRef.current && result.coordinates.length > 0) {
          mapRef.current.fitToCoordinates(
            [riderLocation, hubCoords, ...result.coordinates],
            { 
              edgePadding: { top: 120, right: 80, bottom: 280, left: 80 }, 
              animated: true 
            }
          );
        }
      } else if (isMountedRef.current && !cancelled && mapRef.current) {
        // If route fails (e.g. too far), at least show both points if possible
        mapRef.current.fitToCoordinates(
          [riderLocation, hubCoords],
          { 
            edgePadding: { top: 100, right: 80, bottom: 250, left: 80 }, 
            animated: true 
          }
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [riderLocation?.latitude, riderLocation?.longitude, hubCoords?.latitude, hubCoords?.longitude]); // More specific dependencies

  useEffect(() => {
    if (order?.metadata?.etaMinutes != null && routeCoords.length === 0) {
      setEtaMinutes(order.metadata.etaMinutes);
    }
  }, [order?.metadata?.etaMinutes, routeCoords.length]);

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: sheetExpanded ? SHEET_EXPANDED : SHEET_COLLAPSED,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [sheetExpanded, sheetAnim]);

  const mapRegion = riderLocation
    ? { ...riderLocation, ...MAP_DELTA }
    : hubCoords
      ? { ...hubCoords, ...MAP_DELTA }
      : { ...CHENNAI_CENTER, ...MAP_DELTA };

  const handleBackPress = useCallback(() => {
    if (isMountedRef.current) router.back();
  }, [router]);

  const handleCenterOnUser = useCallback(() => {
    if (riderLocation && mapRef.current) {
      mapRef.current.animateToRegion({ ...riderLocation, ...MAP_DELTA }, 400);
    }
  }, [riderLocation]);

  const handleOpenNavigation = useCallback(() => {
    const dest = hubCoords ?? (deliveryAddress?.coordinates ? { latitude: deliveryAddress.coordinates!.lat, longitude: deliveryAddress.coordinates!.lng } : null);
    const destAddr = hubAddress ?? deliveryLocation;
    if (dest) {
      const url =
        Platform.OS === 'ios'
          ? `maps://app?daddr=${dest.latitude},${dest.longitude}&dirflg=d`
          : `https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}`;
      Linking.openURL(url).catch(() => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destAddr)}`);
      });
    } else if (destAddr) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destAddr)}`);
    }
  }, [hubCoords, hubAddress, deliveryLocation, deliveryAddress]);

  const handleCall = useCallback(() => {
    const supportPhone = process.env.EXPO_PUBLIC_SUPPORT_PHONE?.replace(/\D/g, '');
    const phone = customerPhone || supportPhone || '';
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch(console.warn);
    }
  }, [customerPhone]);

  const handleSwipeAccepted = useCallback(async () => {
    if (!isMountedRef.current || !orderId) return;
    try {
      const { pickOrder } = await import('../api/orders');
      await pickOrder(orderId);
      router.push({
        pathname: '/verify-hub-items',
        params: {
          orderId,
          pickupLocation,
          pickupBay,
          deliveryLocation,
          estimatedPayout: String(estimatedPayout),
          items: String(itemCount),
        },
      });
    } catch (error) {
      console.error('Error marking order picked:', error);
      router.push({
        pathname: '/verify-hub-items',
        params: {
          orderId,
          pickupLocation,
          pickupBay,
          deliveryLocation,
          estimatedPayout: String(estimatedPayout),
          items: String(itemCount),
        },
      });
    }
  }, [orderId, router, pickupLocation, pickupBay, deliveryLocation, estimatedPayout, itemCount]);

  const renderOrderItem = ({ item }: { item: { skuId: string; productName: string; quantity: number } }) => (
    <View style={acceptedOrderStyles.orderItem}>
      <Text variant="bodySm" color={Theme.colors.textDark} style={acceptedOrderStyles.orderItemName}>
        {item.productName || item.skuId}
      </Text>
      <Text variant="bodySm" color={Theme.colors.textGrey} style={acceptedOrderStyles.orderItemQuantity}>
        x{item.quantity}
      </Text>
    </View>
  );

  if (!orderId) {
    return (
      <SafeAreaView style={acceptedOrderStyles.container} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="body" color={Theme.colors.textGrey}>No order selected</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text variant="body" color={Theme.colors.primaryMedium}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={acceptedOrderStyles.container} edges={['top', 'bottom']}>
      <View style={acceptedOrderStyles.mapContainer}>
        {Platform.OS !== 'web' ? (
          <MapView
            ref={mapRef}
            style={{ width: '100%', height: '100%' }}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            mapType="standard"
            loadingEnabled
            loadingIndicatorColor={Theme.colors.primaryMedium}
            loadingBackgroundColor="#FFFFFF"
          >
            {hubCoords && (
              <Marker 
                coordinate={hubCoords} 
                title="Darkstore" 
                description={hubAddress ?? pickupLocation}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={{ 
                  backgroundColor: Theme.colors.white, 
                  borderRadius: scale(20), 
                  padding: scale(6), 
                  borderWidth: 2, 
                  borderColor: Theme.colors.primaryMedium,
                  ...Theme.shadows.medium,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <HubStoreIcon size={scale(24)} color={Theme.colors.primaryMedium} />
                </View>
              </Marker>
            )}
            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeColor="#2196F3"
                strokeWidth={scale(5)}
                lineCap="round"
                lineJoin="round"
              />
            )}
            {riderLocation && (
              <Marker 
                coordinate={riderLocation} 
                title="Your Location"
                anchor={{ x: 0.5, y: 0.5 }}
                flat
              >
                <View style={{
                  width: scale(18),
                  height: scale(18),
                  borderRadius: scale(9),
                  backgroundColor: '#2196F3',
                  borderWidth: 3,
                  borderColor: '#FFFFFF',
                  ...Theme.shadows.small
                }} />
              </Marker>
            )}
            {customerCoords && (
              <Marker
                coordinate={customerCoords}
                title="Customer"
                description={deliveryLocation}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={{ 
                  backgroundColor: Theme.colors.white, 
                  borderRadius: scale(20), 
                  padding: scale(6), 
                  borderWidth: 2, 
                  borderColor: Theme.colors.primaryMedium,
                  ...Theme.shadows.medium,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <CustomerAvatarIcon size={scale(24)} color={Theme.colors.primaryMedium} />
                </View>
              </Marker>
            )}
          </MapView>
        ) : (
          <View style={{ flex: 1, backgroundColor: Theme.colors.gray200, justifyContent: 'center', alignItems: 'center' }}>
            <Text variant="body" color={Theme.colors.textGrey}>Map available in app (iOS/Android)</Text>
          </View>
        )}

        <View style={acceptedOrderStyles.mapOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={[acceptedOrderStyles.topBackButton, { backgroundColor: Theme.colors.white, borderRadius: scale(22), ...Theme.shadows.small }]}
            onPress={handleBackPress}
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
          </View>
        </View>
      </View>

      <Animated.View
        style={[
          acceptedOrderStyles.bottomSheet,
          {
            position: 'absolute',
            bottom: verticalScale(88),
            left: 0,
            right: 0,
            height: sheetAnim,
            flex: undefined,
          },
        ]}
      >
        <Pressable
          style={acceptedOrderStyles.sheetHandle}
          onPress={() => setSheetExpanded((e) => !e)}
        >
          <View style={{ width: scale(42), height: 5, backgroundColor: Theme.colors.borderGrey, borderRadius: 3 }} />
        </Pressable>

        <ScrollView
          ref={scrollViewRef}
          style={acceptedOrderStyles.sheetContent}
          contentContainerStyle={acceptedOrderStyles.sheetContentContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <View style={[acceptedOrderStyles.hubInfoSection, { flexWrap: 'nowrap' }]}>
            <View style={acceptedOrderStyles.hubIconContainer}>
              <HubStoreIcon size={scale(24.5)} color={Theme.colors.primaryMedium} />
            </View>
            <View style={[acceptedOrderStyles.hubInfo, { flex: 1, minWidth: 0 }]}>
              <Text variant="h3" color={Theme.colors.textDark} style={acceptedOrderStyles.hubName} numberOfLines={1}>
                {pickupLocation}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey} style={acceptedOrderStyles.hubAddress} numberOfLines={2}>
                {hubAddress ?? deliveryLocation}
              </Text>
              {pickupBay ? (
                <View style={acceptedOrderStyles.dispatchBayBadge}>
                  <Text variant="bodySm" color={Theme.colors.primaryMedium} style={acceptedOrderStyles.dispatchBayText}>
                    {pickupBay}
                  </Text>
                </View>
              ) : null}
              {deliveryLocation && deliveryLocation !== (hubAddress ?? '') && (
                <View style={{ marginTop: 8 }}>
                  <Text variant="caption" color={Theme.colors.textGrey} style={{ marginBottom: 4 }}>
                    DELIVERY
                  </Text>
                  <Text variant="bodySm" color={Theme.colors.textDark} style={{ fontWeight: '700' }} numberOfLines={2}>
                    {deliveryLocation}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10), flexShrink: 0 }}>
              <TouchableOpacity
                style={[acceptedOrderStyles.callButton, { width: scale(48), height: scale(48), borderRadius: scale(24) }]}
                onPress={handleCall}
                activeOpacity={0.8}
              >
                <CallIcon size={scale(24)} color={Theme.colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: scale(48),
                  height: scale(48),
                  borderRadius: scale(24),
                  backgroundColor: Theme.colors.primaryMedium,
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...Theme.shadows.small,
                  flexShrink: 0,
                }}
                onPress={handleOpenNavigation}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>→</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={acceptedOrderStyles.orderIdSection}>
            <Text variant="caption" color={Theme.colors.textGrey} style={acceptedOrderStyles.orderIdLabel}>
              Order ID
            </Text>
            <Text variant="body" color={Theme.colors.textDark} style={acceptedOrderStyles.orderIdValue}>
              {displayOrderId}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Text variant="caption" color={Theme.colors.textGrey} style={acceptedOrderStyles.orderIdLabel}>
                Estimated Payout
              </Text>
              <Text variant="body" color={Theme.colors.primaryMedium} style={{ ...acceptedOrderStyles.orderIdValue, fontWeight: '700' }}>
                ₹{estimatedPayout}
              </Text>
            </View>
          </View>

          <View style={acceptedOrderStyles.itemsSection}>
            <Text variant="bodySm" color={Theme.colors.textGrey} style={acceptedOrderStyles.itemsTitle}>
              Items to Pick ({itemCount})
            </Text>
            {orderLoading ? (
              <ActivityIndicator size="small" color={Theme.colors.primaryMedium} style={{ paddingVertical: 16 }} />
            ) : orderItems.length > 0 ? (
              <FlatList
                data={orderItems}
                renderItem={renderOrderItem}
                keyExtractor={(item, index) => (item as { _id?: string })._id ?? `item-${index}`}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={acceptedOrderStyles.orderItemSeparator} />}
              />
            ) : (
              <Text variant="bodySm" color={Theme.colors.textGrey} style={{ paddingVertical: 12 }}>
                No items listed
              </Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      <View style={acceptedOrderStyles.bottomButtonContainer}>
        <SwipeToAccept
          label="Swipe to Reach Hub"
          onAccepted={handleSwipeAccepted}
          threshold={0.8}
        />
      </View>
    </SafeAreaView>
  );
}

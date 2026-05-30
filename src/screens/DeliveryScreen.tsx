/**
 * Delivery Screen Component
 * Screen showing delivery information and route to customer – now upgraded with real map and route
 */

import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import CustomerAvatarIcon from '../components/icons/CustomerAvatarIcon';
import { Theme } from '../constants/Theme';
import deliveryScreenStyles from '../styles/deliveryScreenStyles';
import { scale, verticalScale } from '../utils/responsive';
import { getOrder, type BackendOrder } from '../api/orders';
import { geocodeAddress } from '../utils/location';
import { fetchDirections } from '../utils/directions';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CHENNAI_CENTER = { latitude: 13.0827, longitude: 80.2707 };
const MAP_DELTA = { latitudeDelta: 0.03, longitudeDelta: 0.03 };
const SHEET_COLLAPSED = verticalScale(220);
const SHEET_EXPANDED = SCREEN_HEIGHT * 0.7;

export default function DeliveryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    customerName?: string;
    customerAddress?: string;
    estimatedPayout?: string;
    items?: string;
  }>();
  
  const mapRef = useRef<MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(true);

  const [riderLocation, setRiderLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [customerCoords, setCustomerCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [etaMinutes, setEtaMinutes] = useState<number>(10);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const sheetAnim = useRef(new Animated.Value(SHEET_COLLAPSED)).current;

  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';

  const { data: orderRes, isLoading: orderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId && orderId.length > 10,
  });

  const order: BackendOrder | undefined = orderRes?.order;

  const customerName = order?.customerPhoneNumber || params.customerName || 'Customer';
  const deliveryAddress = order?.delivery?.address;
  const customerAddress =
    (deliveryAddress &&
      [deliveryAddress.addressLine1, deliveryAddress.city, deliveryAddress.pincode]
        .filter((s) => s && s !== 'NA')
        .join(', ')) ||
    (params.customerAddress ?? '—');
    
  const estimatedPayout = order?.estimatedPayout ?? (params.estimatedPayout ? parseFloat(params.estimatedPayout) : 0);
  const orderItems = order?.items ?? [];
  const totalItems = orderItems.reduce((s, i) => s + (i.quantity || 0), 0) || (params.items ? parseInt(params.items, 10) : 0);
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

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (isMountedRef.current && !cancelled) {
          setRiderLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }

        watchId = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 2000,
            distanceInterval: 5,
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
    const backendCoords = order?.delivery?.address?.coordinates;
    if (backendCoords?.lat != null && backendCoords?.lng != null) {
      setCustomerCoords({ latitude: backendCoords.lat, longitude: backendCoords.lng });
      return;
    }

    if (!orderId || !customerAddress || customerAddress === '—') return;
    let cancelled = false;
    
    geocodeAddress(customerAddress).then((res) => {
      if (res && isMountedRef.current && !cancelled) {
        setCustomerCoords({ latitude: res.latitude, longitude: res.longitude });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [orderId, customerAddress, order?.delivery?.address?.coordinates?.lat, order?.delivery?.address?.coordinates?.lng]);

  useEffect(() => {
    if (!riderLocation || !customerCoords) return;
    let cancelled = false;

    fetchDirections(riderLocation, customerCoords).then((result) => {
      if (result && isMountedRef.current && !cancelled) {
        const isFirstRoute = routeCoords.length === 0;
        setRouteCoords(result.coordinates);
        setEtaMinutes(result.durationMinutes);
        
        if (isFirstRoute && mapRef.current && result.coordinates.length > 0) {
          mapRef.current.fitToCoordinates(
            [riderLocation, customerCoords],
            { 
              edgePadding: { top: 120, right: 80, bottom: 280, left: 80 }, 
              animated: true 
            }
          );
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [riderLocation?.latitude, riderLocation?.longitude, customerCoords?.latitude, customerCoords?.longitude]);

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: sheetExpanded ? SHEET_EXPANDED : SHEET_COLLAPSED,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [sheetExpanded, sheetAnim]);

  const handleBackPress = useCallback(() => {
    if (isMountedRef.current) router.back();
  }, [router]);

  const handleCenterOnUser = useCallback(() => {
    if (riderLocation && mapRef.current) {
      mapRef.current.animateToRegion({ ...riderLocation, ...MAP_DELTA }, 400);
    }
  }, [riderLocation]);

  const handleOpenNavigation = useCallback(() => {
    const dest = customerCoords;
    if (dest) {
      const url =
        Platform.OS === 'ios'
          ? `maps://app?daddr=${dest.latitude},${dest.longitude}&dirflg=d`
          : `https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}`;
      Linking.openURL(url).catch(() => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`);
      });
    } else if (customerAddress) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`);
    }
  }, [customerCoords, customerAddress]);

  const handleCall = useCallback(() => {
    if (customerPhone) {
      Linking.openURL(`tel:${customerPhone}`).catch(console.warn);
    }
  }, [customerPhone]);

  const handleSwipeAccepted = useCallback(async () => {
    if (!isMountedRef.current || !orderId) return;
    try {
      const { outForDeliveryOrder } = await import('../api/orders');
      await outForDeliveryOrder(orderId);
      router.push({
        pathname: '/handover-order',
        params: {
          orderId,
          customerName,
          customerAddress,
          estimatedPayout: String(estimatedPayout),
          items: String(totalItems),
        },
      });
    } catch (error) {
      console.error('Error marking out-for-delivery:', error);
      router.push({
        pathname: '/handover-order',
        params: {
          orderId,
          customerName,
          customerAddress,
          estimatedPayout: String(estimatedPayout),
          items: String(totalItems),
        },
      });
    }
  }, [orderId, router, customerName, customerAddress, estimatedPayout, totalItems]);

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={deliveryScreenStyles.orderItem}>
      <Text variant="bodySm" color={Theme.colors.textDark} style={deliveryScreenStyles.orderItemName}>
        {item.productName || item.skuId}
      </Text>
      <Text variant="bodySm" color={Theme.colors.textGrey} style={deliveryScreenStyles.orderItemQuantity}>
        x{item.quantity}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={deliveryScreenStyles.container} edges={['top', 'bottom']}>
      <View style={deliveryScreenStyles.mapContainer}>
        {Platform.OS !== 'web' ? (
          <MapView
            ref={mapRef}
            style={{ width: '100%', height: '100%' }}
            provider={PROVIDER_GOOGLE}
            initialRegion={riderLocation ? { ...riderLocation, ...MAP_DELTA } : { ...CHENNAI_CENTER, ...MAP_DELTA }}
            showsUserLocation={false}
            showsMyLocationButton={false}
            mapType="standard"
            loadingEnabled
          >
            {customerCoords && (
              <Marker 
                coordinate={customerCoords} 
                title="Customer" 
                description={customerAddress}
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
          </MapView>
        ) : (
          <View style={{ flex: 1, backgroundColor: Theme.colors.gray200, justifyContent: 'center', alignItems: 'center' }}>
            <Text variant="body" color={Theme.colors.textGrey}>Map available in app</Text>
          </View>
        )}

        <View style={deliveryScreenStyles.mapOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={[deliveryScreenStyles.topBackButton, { backgroundColor: Theme.colors.white, borderRadius: scale(22), ...Theme.shadows.small }]}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <BackArrowIcon size={scale(26)} color={Theme.colors.textDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={deliveryScreenStyles.locationButton}
            onPress={handleCenterOnUser}
            activeOpacity={0.8}
          >
            <LocationIcon size={scale(17.5)} color={Theme.colors.primaryMedium} />
          </TouchableOpacity>

          <View style={deliveryScreenStyles.etaBadge}>
            <Text variant="caption" color={Theme.colors.textGrey} style={deliveryScreenStyles.etaLabel}>
              ETA
            </Text>
            <Text variant="body" color={Theme.colors.textDark} style={deliveryScreenStyles.etaTime}>
              {etaMinutes} mins
            </Text>
          </View>
        </View>
      </View>

      <Animated.View
        style={[
          deliveryScreenStyles.bottomSheet,
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
          style={deliveryScreenStyles.sheetHandle}
          onPress={() => setSheetExpanded((e) => !e)}
        >
          <View style={{ width: scale(42), height: 5, backgroundColor: Theme.colors.borderGrey, borderRadius: 3 }} />
        </Pressable>

        <ScrollView
          ref={scrollViewRef}
          style={deliveryScreenStyles.sheetContent}
          contentContainerStyle={deliveryScreenStyles.sheetContentContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <View style={[deliveryScreenStyles.customerInfoSection, { flexWrap: 'nowrap' }]}>
            <View style={deliveryScreenStyles.customerAvatarContainer}>
              <CustomerAvatarIcon size={scale(24.5)} color={Theme.colors.primaryMedium} />
            </View>
            <View style={[deliveryScreenStyles.customerInfo, { flex: 1, minWidth: 0 }]}>
              <Text variant="h3" color={Theme.colors.textDark} style={deliveryScreenStyles.customerName} numberOfLines={1}>
                {customerName}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey} style={deliveryScreenStyles.customerAddress} numberOfLines={2}>
                {customerAddress}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10), flexShrink: 0 }}>
              <TouchableOpacity
                style={[deliveryScreenStyles.callButton, { width: scale(48), height: scale(48), borderRadius: scale(24) }]}
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

          <View style={deliveryScreenStyles.orderInfoCards}>
            <View style={deliveryScreenStyles.orderInfoCard}>
              <Text variant="caption" color={Theme.colors.textGrey} style={deliveryScreenStyles.orderInfoLabel}>
                Order ID
              </Text>
              <Text variant="body" color={Theme.colors.textDark} style={deliveryScreenStyles.orderInfoValue}>
                {order?.orderNumber || orderId}
              </Text>
            </View>
            <View style={deliveryScreenStyles.orderInfoCard}>
              <Text variant="caption" color={Theme.colors.textGrey} style={deliveryScreenStyles.orderInfoLabel}>
                Payout
              </Text>
              <Text variant="body" color={Theme.colors.primaryMedium} style={{ ...deliveryScreenStyles.orderInfoValueBold, fontWeight: '700' }}>
                ₹{estimatedPayout}
              </Text>
            </View>
          </View>

          <View style={deliveryScreenStyles.itemsSection}>
            <Text variant="bodySm" color={Theme.colors.textGrey} style={deliveryScreenStyles.itemsTitle}>
              Order Items ({totalItems})
            </Text>
            {orderLoading ? (
              <ActivityIndicator size="small" color={Theme.colors.primaryMedium} style={{ paddingVertical: 16 }} />
            ) : orderItems.length > 0 ? (
              <FlatList
                data={orderItems}
                renderItem={renderOrderItem}
                keyExtractor={(item, index) => (item as any)._id ?? `item-${index}`}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={deliveryScreenStyles.orderItemSeparator} />}
              />
            ) : (
              <Text variant="bodySm" color={Theme.colors.textGrey} style={{ paddingVertical: 12 }}>
                No items listed
              </Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      <View style={deliveryScreenStyles.bottomButtonContainer}>
        <SwipeToAccept
          label="Swipe to Arrive"
          onAccepted={handleSwipeAccepted}
          threshold={0.8}
        />
      </View>
    </SafeAreaView>
  );
}

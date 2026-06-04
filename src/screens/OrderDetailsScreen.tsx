/**
 * Order Details Screen — read-only order view with shared map + address source.
 */

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
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryActionButton from '../components/common/PrimaryActionButton';
import Text from '../components/common/Text';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import LocationIcon from '../components/icons/LocationIcon';
import CallIcon from '../components/icons/CallIcon';
import HubStoreIcon from '../components/icons/HubStoreIcon';
import OrderLiveMapView from '../components/features/OrderLiveMapView';
import { Theme } from '../constants/Theme';
import { useActiveOrder } from '../hooks/useActiveOrder';
import { useOrderMapData } from '../hooks/useOrderMapData';
import orderDetailsStyles from '../styles/orderDetailsStyles';
import { iconButtonStyles } from '../styles/iconButtonStyles';
import { formatDeliveryAddress, getPickupLabel } from '../utils/fleetMapCoords';
import { getWorkflowRoute } from '../utils/orderWorkflow';
import { scale, verticalScale } from '../utils/responsive';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_COLLAPSED = verticalScale(220);
const SHEET_EXPANDED = SCREEN_HEIGHT * 0.7;

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(true);

  const [sheetExpanded, setSheetExpanded] = useState(false);
  const sheetAnim = useRef(new Animated.Value(SHEET_COLLAPSED)).current;

  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';
  const { order, isLoading: orderLoading } = useActiveOrder(orderId);

  const {
    riderLocation,
    pickupCoords,
    dropCoords,
    routeCoords,
    etaMinutes,
    deliveryAddress,
    pickupLabel,
    fitCoordinates,
  } = useOrderMapData(order, 'to_hub');

  const displayOrderId = order?.orderNumber ?? orderId;
  const estimatedPayout = order?.estimatedPayout ?? 0;
  const pickupLocation = order ? getPickupLabel(order) : '';
  const orderItems = order?.items ?? [];
  const totalItems = orderItems.reduce((s, i) => s + (i.quantity || 0), 0);
  const customerPhone = order?.customerPhoneNumber?.replace(/\D/g, '') || '';
  const status = (order?.status || '').toLowerCase();
  const isAssigned = status === 'assigned';

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  const handleOpenNavigation = useCallback(() => {
    const dest = pickupCoords ?? dropCoords;
    if (dest) {
      const url =
        Platform.OS === 'ios'
          ? `maps://app?daddr=${dest.latitude},${dest.longitude}&dirflg=d`
          : `https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}`;
      Linking.openURL(url).catch(() => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickupLocation)}`);
      });
    } else if (pickupLocation) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickupLocation)}`);
    }
  }, [pickupCoords, dropCoords, pickupLocation]);

  const handleCall = useCallback(() => {
    const supportPhone = process.env.EXPO_PUBLIC_SUPPORT_PHONE?.replace(/\D/g, '');
    const phone = customerPhone || supportPhone || '';
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch(console.warn);
    }
  }, [customerPhone]);

  const handleSwipeAccepted = useCallback(() => {
    if (!isMountedRef.current || !orderId || !order) return;
    const route = getWorkflowRoute(order);
    router.push({ pathname: route, params: { orderId } });
  }, [order, orderId, router]);

  const renderOrderItem = ({ item }: { item: { skuId: string; productName: string; quantity: number } }) => (
    <View style={orderDetailsStyles.orderItem}>
      <Text variant="bodySm" color={Theme.colors.textDark} style={orderDetailsStyles.orderItemName}>
        {item.productName || item.skuId}
      </Text>
      <Text variant="bodySm" color={Theme.colors.textGrey} style={orderDetailsStyles.orderItemQuantity}>
        x{item.quantity}
      </Text>
    </View>
  );

  if (!orderId) {
    return (
      <SafeAreaView style={orderDetailsStyles.container} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="body" color={Theme.colors.textGrey}>No order details</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={orderDetailsStyles.container} edges={['top', 'bottom']}>
      <View style={orderDetailsStyles.mapContainer}>
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

        <View style={orderDetailsStyles.mapOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={[orderDetailsStyles.topBackButton, iconButtonStyles.light]}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <BackArrowIcon size={scale(26)} color={Theme.colors.textDark} />
          </TouchableOpacity>

          <TouchableOpacity style={orderDetailsStyles.locationButton} activeOpacity={0.8}>
            <LocationIcon size={scale(17.5)} color={Theme.colors.primaryMedium} />
          </TouchableOpacity>

          <View style={orderDetailsStyles.etaBadge}>
            <Text variant="caption" color={Theme.colors.textGrey} style={orderDetailsStyles.etaLabel}>
              ETA
            </Text>
            <Text variant="body" color={Theme.colors.textDark} style={orderDetailsStyles.etaTime}>
              {etaMinutes} mins
            </Text>
          </View>
        </View>
      </View>

      <Animated.View
        style={[
          orderDetailsStyles.bottomSheet,
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
        <Pressable style={orderDetailsStyles.sheetHandle} onPress={() => setSheetExpanded((e) => !e)}>
          <View style={{ width: scale(42), height: 5, backgroundColor: Theme.colors.borderGrey, borderRadius: 3 }} />
        </Pressable>

        <ScrollView
          ref={scrollViewRef}
          style={orderDetailsStyles.sheetContent}
          contentContainerStyle={orderDetailsStyles.sheetContentContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <View style={[orderDetailsStyles.hubInfoSection, { flexWrap: 'nowrap' }]}>
            <View style={orderDetailsStyles.hubIconContainer}>
              <HubStoreIcon size={scale(24.5)} color={Theme.colors.primaryMedium} />
            </View>
            <View style={[orderDetailsStyles.hubInfo, { flex: 1, minWidth: 0 }]}>
              <Text variant="h3" color={Theme.colors.textDark} style={orderDetailsStyles.hubName} numberOfLines={1}>
                {pickupLocation}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey} style={orderDetailsStyles.hubAddress} numberOfLines={2}>
                {pickupLabel}
              </Text>
              {deliveryAddress ? (
                <View style={{ marginTop: 8 }}>
                  <Text variant="caption" color={Theme.colors.textGrey}>DELIVERY</Text>
                  <Text variant="bodySm" color={Theme.colors.textDark} numberOfLines={2}>
                    {deliveryAddress}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10), flexShrink: 0 }}>
              <TouchableOpacity style={iconButtonStyles.call} onPress={handleCall} activeOpacity={0.8}>
                <CallIcon size={scale(24)} color={Theme.colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={iconButtonStyles.primary} onPress={handleOpenNavigation} activeOpacity={0.8}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center' }}>→</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={orderDetailsStyles.orderIdSection}>
            <Text variant="caption" color={Theme.colors.textGrey} style={orderDetailsStyles.orderIdLabel}>
              Order ID
            </Text>
            <Text variant="body" color={Theme.colors.textDark} style={orderDetailsStyles.orderIdValue}>
              {displayOrderId}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Text variant="caption" color={Theme.colors.textGrey} style={orderDetailsStyles.orderIdLabel}>
                Estimated Payout
              </Text>
              <Text variant="body" color={Theme.colors.primaryMedium} style={{ ...orderDetailsStyles.orderIdValue, fontWeight: '700' }}>
                ₹{estimatedPayout}
              </Text>
            </View>
          </View>

          <View style={orderDetailsStyles.itemsSection}>
            <Text variant="bodySm" color={Theme.colors.textGrey} style={orderDetailsStyles.itemsTitle}>
              Items ({totalItems})
            </Text>
            {orderLoading ? (
              <ActivityIndicator size="small" color={Theme.colors.primaryMedium} style={{ paddingVertical: 16 }} />
            ) : orderItems.length > 0 ? (
              <FlatList
                data={orderItems}
                renderItem={renderOrderItem}
                keyExtractor={(item, index) => (item as { _id?: string })._id ?? `item-${index}`}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={orderDetailsStyles.orderItemSeparator} />}
              />
            ) : (
              <Text variant="bodySm" color={Theme.colors.textGrey} style={{ paddingVertical: 12 }}>
                No items listed
              </Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      <View style={orderDetailsStyles.bottomButtonContainer}>
        {isAssigned ? (
          <PrimaryActionButton label="Reach Hub" onPress={handleSwipeAccepted} />
        ) : (
          <TouchableOpacity
            style={[orderDetailsStyles.callButton, { width: '100%', borderRadius: scale(8) }]}
            onPress={() => router.back()}
          >
            <Text variant="body" color={Theme.colors.white}>Back to List</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

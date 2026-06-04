/**
 * Delivery Screen — route to customer using shared active-order cache and map data.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
import CustomerAvatarIcon from '../components/icons/CustomerAvatarIcon';
import OrderLiveMapView from '../components/features/OrderLiveMapView';
import { Theme } from '../constants/Theme';
import { useActiveOrder, invalidateActiveOrder } from '../hooks/useActiveOrder';
import { useOrderMapData } from '../hooks/useOrderMapData';
import deliveryScreenStyles from '../styles/deliveryScreenStyles';
import { iconButtonStyles } from '../styles/iconButtonStyles';
import { formatCustomerPhone, formatDeliveryAddress } from '../utils/fleetMapCoords';
import { scale, verticalScale } from '../utils/responsive';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_COLLAPSED = verticalScale(220);
const SHEET_EXPANDED = SCREEN_HEIGHT * 0.7;

export default function DeliveryScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(true);

  const [sheetExpanded, setSheetExpanded] = useState(false);
  const sheetAnim = useRef(new Animated.Value(SHEET_COLLAPSED)).current;

  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? '';
  const { order, isLoading: orderLoading } = useActiveOrder(orderId);

  const {
    riderLocation,
    dropCoords,
    routeCoords,
    etaMinutes,
    deliveryAddress,
    fitCoordinates,
  } = useOrderMapData(order, 'to_drop');

  const displayOrderId = order?.orderNumber ?? orderId;
  const estimatedPayout = order?.estimatedPayout ?? 0;
  const orderItems = order?.items ?? [];
  const totalItems = orderItems.reduce((s, i) => s + (i.quantity || 0), 0);
  const customerPhone = order?.customerPhoneNumber?.replace(/\D/g, '') || '';
  const customerLabel = formatCustomerPhone(order) || displayOrderId;

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

  const handleCenterOnUser = useCallback(() => {}, []);

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
      invalidateActiveOrder(queryClient, orderId);
    } catch (error) {
      console.error('Error marking out-for-delivery:', error);
    }
    router.push({ pathname: '/customer-navigation', params: { orderId } });
  }, [orderId, router, queryClient]);

  const renderOrderItem = ({ item }: { item: { skuId: string; productName: string; quantity: number } }) => (
    <View style={deliveryScreenStyles.orderItem}>
      <Text variant="bodySm" color={Theme.colors.textDark} style={deliveryScreenStyles.orderItemName}>
        {item.productName || item.skuId}
      </Text>
      <Text variant="bodySm" color={Theme.colors.textGrey} style={deliveryScreenStyles.orderItemQuantity}>
        x{item.quantity}
      </Text>
    </View>
  );

  if (!orderId) {
    return (
      <SafeAreaView style={deliveryScreenStyles.container} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="body" color={Theme.colors.textGrey}>No order selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={deliveryScreenStyles.container} edges={['top', 'bottom']}>
      <View style={deliveryScreenStyles.mapContainer}>
        <OrderLiveMapView
          riderLocation={riderLocation}
          pickupCoords={null}
          dropCoords={dropCoords}
          routeCoords={routeCoords}
          fitCoordinates={fitCoordinates}
          deliveryAddress={deliveryAddress}
          showPickup={false}
          showDrop
          showRider
        />

        <View style={deliveryScreenStyles.mapOverlay} pointerEvents="box-none">
          <TouchableOpacity
            style={[deliveryScreenStyles.topBackButton, iconButtonStyles.light]}
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
                {customerLabel}
              </Text>
              <Text variant="bodySm" color={Theme.colors.textGrey} style={deliveryScreenStyles.customerAddress} numberOfLines={2}>
                {orderLoading ? 'Loading address…' : deliveryAddress || formatDeliveryAddress(order)}
              </Text>
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

          <View style={deliveryScreenStyles.orderInfoCards}>
            <View style={deliveryScreenStyles.orderInfoCard}>
              <Text variant="caption" color={Theme.colors.textGrey} style={deliveryScreenStyles.orderInfoLabel}>
                Order ID
              </Text>
              <Text variant="body" color={Theme.colors.textDark} style={deliveryScreenStyles.orderInfoValue}>
                {displayOrderId}
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
                keyExtractor={(item, index) => (item as { _id?: string })._id ?? `item-${index}`}
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
        <PrimaryActionButton label="Arrive at Customer" onPress={handleSwipeAccepted} />
      </View>
    </SafeAreaView>
  );
}

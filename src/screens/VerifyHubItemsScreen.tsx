/**
 * Verify Hub Items Screen Component
 * Screen for verifying and checking off items collected from dispatch bay
 * Matches Figma design exactly
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/common/Text';
import CheckIcon from '../components/icons/CheckIcon';
import RightArrowIcon from '../components/icons/RightArrowIcon';
import Header from '../components/layout/Header';
import { Theme } from '../constants/Theme';
import verifyHubItemsStyles from '../styles/verifyHubItemsStyles';
import { scale } from '../utils/responsive';
import { getOrder } from '../api/orders';
import { useConfigWithDefaults } from '../contexts';

interface HubItem {
  id: string;
  name: string;
  quantity: number;
  selected: boolean;
}

const FALLBACK_ITEMS: HubItem[] = [
  { id: '1', name: 'Amul Milk 1L', quantity: 2, selected: false },
  { id: '2', name: 'Bread - White', quantity: 1, selected: false },
  { id: '3', name: 'Eggs - 6pcs', quantity: 1, selected: false },
  { id: '4', name: 'Tomatoes 500g', quantity: 1, selected: false },
  { id: '5', name: 'Onions 1kg', quantity: 1, selected: false },
  { id: '6', name: 'Rice 5kg', quantity: 1, selected: false },
  { id: '7', name: 'Cooking Oil 1L', quantity: 1, selected: false },
  { id: '8', name: 'Sugar 1kg', quantity: 1, selected: false },
];

export default function VerifyHubItemsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const config = useConfigWithDefaults();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

  const { data: orderRes } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  });

  const orderItems = useMemo(() => {
    const list = orderRes?.order?.items;
    if (!list?.length) return FALLBACK_ITEMS;
    return list.map((it, i) => ({
      id: (it as any)._id || `${it.skuId || 'item'}-${i}`,
      name: it.productName || `Item ${i + 1}`,
      quantity: it.quantity || 1,
      selected: false,
    }));
  }, [orderRes?.order?.items]);

  const pickupBay =
    Array.isArray(params.pickupBay) ? params.pickupBay[0] : params.pickupBay
    || ((orderRes?.order?.darkstoreCode || orderRes?.order?.warehouseCode) ? `Darkstore ${orderRes.order.darkstoreCode || orderRes.order.warehouseCode}` : config.defaultHubName);

  const [items, setItems] = useState<HubItem[]>(orderItems);
  const [progressAnim] = useState(new Animated.Value(0));
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setItems(orderItems);
  }, [orderItems]);

  const totalItems = items.length;
  const selectedCount = items.filter((item) => item.selected).length;
  const remaining = totalItems - selectedCount;
  const progress = totalItems > 0 ? selectedCount / totalItems : 0;

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const handleBack = useCallback(() => {
    if (!isMountedRef.current) return;
    try {
      router.back();
    } catch (error) {
      console.error('Error handling back press:', error);
    }
  }, [router]);

  const toggleItem = useCallback((itemId: string) => {
    if (!isMountedRef.current) return;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  const handleBottomButtonPress = useCallback(() => {
    if (!isMountedRef.current) return;
    if (remaining === 0) {
      try {
        const order = orderRes?.order;
        const addr = order?.delivery?.address;
        const deliveryLine = addr
          ? [addr.addressLine1, addr.addressLine2, addr.city, addr.pincode].filter(Boolean).join(', ')
          : 'Delivery address';
        router.push({
          pathname: '/delivery',
          params: {
            orderId: orderId || order?._id || '',
            customerName: order?.customerPhoneNumber || 'Customer',
            customerAddress: deliveryLine,
            estimatedPayout: String(order?.estimatedPayout ?? 0),
            items: String(items.length),
          },
        });
      } catch (error) {
        console.error('Error navigating after verification:', error);
      }
    }
  }, [remaining, router, params, orderId, orderRes?.order, items.length]);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderItemRow = (item: HubItem) => (
    <TouchableOpacity
      key={item.id}
      style={verifyHubItemsStyles.itemCard}
      onPress={() => toggleItem(item.id)}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <View
        style={[
          verifyHubItemsStyles.checkbox,
          item.selected && verifyHubItemsStyles.checkboxChecked,
        ]}
      >
        {item.selected && (
          <CheckIcon size={scale(24)} color={Theme.colors.white} />
        )}
      </View>

      {/* Item Name */}
      <Text variant="bodySm" color="#364153" style={verifyHubItemsStyles.itemName}>
        {item.name}
      </Text>

      {/* Quantity Pill */}
      <View style={verifyHubItemsStyles.quantityPill}>
        <Text variant="caption" color="#4A5565" style={verifyHubItemsStyles.quantityText}>
          x{item.quantity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={verifyHubItemsStyles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={verifyHubItemsStyles.header}>
        <Header
          title="Verify Hub Items"
          subtitle={`Collect from ${pickupBay}`}
          onBack={handleBack}
        />
        
        {/* Progress Bar */}
        <View style={verifyHubItemsStyles.progressContainer}>
          <View style={verifyHubItemsStyles.progressBarContainer}>
            <Animated.View
              style={[
                verifyHubItemsStyles.progressBarFill,
                { width: progressBarWidth },
              ]}
            />
          </View>
          <Text variant="bodySm" color="#6A7282" style={verifyHubItemsStyles.progressText}>
            {selectedCount}/{items.length}
          </Text>
        </View>
      </View>

      {/* Items List */}
      <ScrollView
        style={verifyHubItemsStyles.content}
        contentContainerStyle={{ gap: scale(10.5) }}
        showsVerticalScrollIndicator={false}
      >
        {items.map(renderItemRow)}
      </ScrollView>

      {/* Bottom Button */}
      <View style={verifyHubItemsStyles.bottomButtonContainer}>
        <TouchableOpacity
          style={[
            verifyHubItemsStyles.bottomButton,
            remaining > 0 && verifyHubItemsStyles.bottomButtonDisabled,
          ]}
          onPress={handleBottomButtonPress}
          activeOpacity={remaining === 0 ? 0.8 : 1}
          disabled={remaining > 0}
        >
          {/* Left Circle */}
          <View style={verifyHubItemsStyles.bottomButtonLeftCircle}>
            <RightArrowIcon size={scale(17.5)} color={Theme.colors.white} />
          </View>

          {/* Center Text */}
          <Text variant="body" color={Theme.colors.white} style={verifyHubItemsStyles.bottomButtonText}>
            {remaining > 0 ? `Pick ${remaining} More Items` : 'Proceed'}
          </Text>

          {/* Right Icon Circle */}
          <View style={verifyHubItemsStyles.bottomButtonRightIcon}>
            <RightArrowIcon size={scale(21)} color="#32C96A" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


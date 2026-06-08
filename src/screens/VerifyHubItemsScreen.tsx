/**
 * Verify Hub Items Screen Component
 * Screen for verifying and checking off items collected from dispatch bay
 */

import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { pickOrder } from '../api/orders';
import { useConfigWithDefaults } from '../contexts';
import { useActiveOrder, invalidateActiveOrder } from '../hooks/useActiveOrder';
import { getPickupLabel } from '../utils/fleetMapCoords';

interface HubItem {
  id: string;
  name: string;
  quantity: number;
  selected: boolean;
}

export default function VerifyHubItemsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const config = useConfigWithDefaults();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

  const { order, isLoading, isError, error } = useActiveOrder(orderId);

  const orderItems = useMemo(() => {
    const list = order?.items;
    if (!list?.length) return [] as HubItem[];
    return list.map((it, i) => ({
      id: (it as { _id?: string })._id || `${it.skuId || 'item'}-${i}`,
      name: it.productName || it.skuId || '',
      quantity: it.quantity || 1,
      selected: false,
    }));
  }, [order?.items]);

  const pickupBay =
    (Array.isArray(params.pickupBay) ? params.pickupBay[0] : params.pickupBay) ||
    getPickupLabel(order) ||
    config.defaultHubName;

  const [items, setItems] = useState<HubItem[]>([]);
  const [progressAnim] = useState(new Animated.Value(0));
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const handleBack = useCallback(() => {
    if (!isMountedRef.current) return;
    router.back();
  }, [router]);

  const toggleItem = useCallback((itemId: string) => {
    if (!isMountedRef.current) return;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  const handleBottomButtonPress = useCallback(async () => {
    if (!isMountedRef.current || remaining > 0 || submitting) return;
    const oid = orderId || order?._id;
    if (!oid) return;

    setSubmitting(true);
    try {
      await pickOrder(oid);
      invalidateActiveOrder(queryClient, oid);
      router.push({ pathname: '/delivery', params: { orderId: oid } });
    } catch (err) {
      console.error('Error after hub verification:', err);
    } finally {
      if (isMountedRef.current) setSubmitting(false);
    }
  }, [remaining, submitting, router, orderId, order, queryClient]);

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
      <View
        style={[
          verifyHubItemsStyles.checkbox,
          item.selected && verifyHubItemsStyles.checkboxChecked,
        ]}
      >
        {item.selected && <CheckIcon size={scale(24)} color={Theme.colors.white} />}
      </View>
      <Text variant="bodySm" color="#364153" style={verifyHubItemsStyles.itemName}>
        {item.name}
      </Text>
      <View style={verifyHubItemsStyles.quantityPill}>
        <Text variant="caption" color="#4A5565" style={verifyHubItemsStyles.quantityText}>
          x{item.quantity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={verifyHubItemsStyles.container} edges={['top', 'bottom']}>
      <View style={verifyHubItemsStyles.header}>
        <Header title="Verify Hub Items" subtitle={`Collect from ${pickupBay}`} onBack={handleBack} />
        <View style={verifyHubItemsStyles.progressContainer}>
          <View style={verifyHubItemsStyles.progressBarContainer}>
            <Animated.View style={[verifyHubItemsStyles.progressBarFill, { width: progressBarWidth }]} />
          </View>
          <Text variant="bodySm" color="#6A7282" style={verifyHubItemsStyles.progressText}>
            {selectedCount}/{Math.max(items.length, 1)}
          </Text>
        </View>
      </View>

      <ScrollView
        style={verifyHubItemsStyles.content}
        contentContainerStyle={{ gap: scale(10.5), flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ paddingVertical: scale(40), alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Theme.colors.primaryMedium} />
            <Text variant="caption" color={Theme.colors.textGrey} style={{ marginTop: scale(8) }}>
              Loading order items…
            </Text>
          </View>
        ) : isError ? (
          <View style={{ paddingVertical: scale(24), alignItems: 'center' }}>
            <Text variant="bodySm" color={Theme.colors.textGrey}>
              {error instanceof Error ? error.message : 'Failed to load order'}
            </Text>
          </View>
        ) : items.length === 0 ? (
          <View style={{ paddingVertical: scale(24), alignItems: 'center' }}>
            <Text variant="bodySm" color={Theme.colors.textGrey}>
              No items found for this order.
            </Text>
          </View>
        ) : (
          items.map(renderItemRow)
        )}
      </ScrollView>

      <View style={verifyHubItemsStyles.bottomButtonContainer}>
        <TouchableOpacity
          style={[
            verifyHubItemsStyles.bottomButton,
            (remaining > 0 || submitting) && verifyHubItemsStyles.bottomButtonDisabled,
          ]}
          onPress={handleBottomButtonPress}
          activeOpacity={remaining === 0 && !submitting ? 0.8 : 1}
          disabled={remaining > 0 || submitting || items.length === 0}
        >
          <View style={verifyHubItemsStyles.bottomButtonLeftCircle}>
            <RightArrowIcon size={scale(17.5)} color={Theme.colors.white} />
          </View>
          <Text variant="body" color={Theme.colors.white} style={verifyHubItemsStyles.bottomButtonText}>
            {submitting ? 'Saving…' : remaining > 0 ? `Pick ${remaining} More Items` : 'Proceed to Delivery'}
          </Text>
          <View style={verifyHubItemsStyles.bottomButtonRightIcon}>
            <RightArrowIcon size={scale(21)} color="#237227" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

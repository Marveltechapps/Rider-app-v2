/**
 * Live Orders Screen
 * Displays available orders (to accept) and previously assigned active orders (in progress)
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  InteractionManager,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/layout/Header';
import Text from '../components/common/Text';
import OrderCard, { Order } from '../components/features/OrderCard';
import { Theme } from '../constants/Theme';
import { useUser } from '../contexts';
import { scale, verticalScale } from '../utils/responsive';
import { listOrders, acceptOrder, mapOrderToCard, rejectOrder, type BackendOrder } from '../api/orders';
import { riderWebSocketService } from '../services/websocket.service';
import { getHome } from '../api/home';
import { getMyShifts, type BackendRiderShift } from '../api/shifts';

const parseShiftTimeToDate = (dateStr: string, timeStr: string): Date | null => {
  try {
    const base = new Date(dateStr);
    if (Number.isNaN(base.getTime())) return null;

    const trimmed = timeStr.trim();
    if (!trimmed) return null;

    const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([APap][Mm])$/);
    if (amPmMatch) {
      let hour = parseInt(amPmMatch[1], 10);
      const minute = parseInt(amPmMatch[2], 10);
      const suffix = amPmMatch[3].toUpperCase();
      if (suffix === 'PM' && hour < 12) hour += 12;
      if (suffix === 'AM' && hour === 12) hour = 0;
      base.setHours(hour, minute, 0, 0);
      return base;
    }

    const parts = trimmed.split(':');
    if (parts.length >= 2) {
      const hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);
      if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
        base.setHours(hour, minute, 0, 0);
        return base;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export default function LiveOrdersScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userData } = useUser();

  // Determine whether the rider is currently on shift (same logic as HomeScreen).
  const { data: homeResponse } = useQuery({
    queryKey: ['rider-home', userData?.riderId],
    queryFn: () => getHome(),
    enabled: !!userData?.riderId,
    staleTime: 15 * 1000,
  });

  const { data: myShiftsToday = [] } = useQuery({
    queryKey: ['my-shifts-today', userData?.riderId],
    queryFn: async () => {
      const todayIso = new Date().toISOString().slice(0, 10);
      return getMyShifts(todayIso);
    },
    enabled: !!userData?.riderId,
    staleTime: 60 * 1000,
  });

  const activeBookedShift: BackendRiderShift | null = useMemo(() => {
    if (!myShiftsToday.length) return null;
    const now = new Date();
    return (
      myShiftsToday.find((shift) => {
        if (!shift.date || !shift.startTime || !shift.endTime) return false;
        const start = parseShiftTimeToDate(shift.date, shift.startTime);
        const end = parseShiftTimeToDate(shift.date, shift.endTime);
        if (!start || !end) return false;
        return now >= start && now <= end;
      }) ?? null
    );
  }, [myShiftsToday]);

  const currentShift = (homeResponse as any)?.rider?.currentShift ?? null;
  const isOnShift = Boolean(currentShift || activeBookedShift);

  const fetchOrders = useCallback(async () => {
    const res = await listOrders({ limit: 50 });
    return res;
  }, []);

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['orders', 'list', userData?.riderId],
    queryFn: fetchOrders,
    enabled: !!userData?.riderId && isOnShift,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true, // Refetch when app comes to foreground (WebSocket is primary for real-time)
  });

  // WebSocket connection is managed at app level (tab layout). Here we only trigger refetch on push.
  React.useEffect(() => {
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      refetch();
    };
    riderWebSocketService.on('orders:refresh', handler);
    return () => riderWebSocketService.off('orders:refresh', handler);
  }, [queryClient, refetch]);

  const ordersFromApi = ordersData?.orders ?? [];

  // When the rider goes off-shift, hide orders immediately and best-effort mark pending work as missed.
  const lastOnShiftRef = useRef<boolean>(isOnShift);
  useEffect(() => {
    const wasOnShift = lastOnShiftRef.current;
    lastOnShiftRef.current = isOnShift;
    if (!wasOnShift || isOnShift) return;

    const cached = queryClient.getQueryData<any>(['orders', 'list', userData?.riderId]);
    const cachedOrders: BackendOrder[] = cached?.orders ?? [];
    const openOrders = cachedOrders.filter(
      (o) => !['delivered', 'cancelled', 'returned'].includes((o.status || '').toLowerCase())
    );

    // Best-effort: reject any non-completed orders so backend can record them as missed/rejected.
    // (There is no dedicated "missed" order endpoint in the current API.)
    if (openOrders.length) {
      Promise.allSettled(openOrders.map((o) => rejectOrder(o._id, 'missed_shift'))).finally(() => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      });
    }

    // Hide all orders while off shift (even if cache still has data).
    queryClient.setQueryData(['orders', 'list', userData?.riderId], { orders: [], count: 0 });
  }, [isOnShift, queryClient, userData?.riderId]);
  const availableOrders: Order[] = ordersFromApi
    .filter((o) => o.status?.toLowerCase() === 'assigned' && !o.riderAssignment?.acceptedAt)
    .map((o) => mapOrderToCard(o));
  const activeOrders: Order[] = ordersFromApi
    .filter((o) => 
      (o.status?.toLowerCase() === 'assigned' && !!o.riderAssignment?.acceptedAt) ||
      ['picked', 'out_for_delivery'].includes((o.status || '').toLowerCase())
    )
    .map((o) => mapOrderToCard(o));
  const previouslyAssignedOrders: Order[] = ordersFromApi
    .filter((o) => ['delivered', 'cancelled', 'returned'].includes((o.status || '').toLowerCase()))
    .map((o) => mapOrderToCard(o));

  const handleOrderAccept = useCallback(
    async (orderId: string) => {
      const backendOrder = ordersFromApi.find((o) => o._id === orderId || o.orderNumber === orderId);
      const card = backendOrder ? mapOrderToCard(backendOrder) : { orderId, estimatedPayout: 0, pickupLocation: '', deliveryLocation: '', distance: '', time: '', items: 0 };
      const navParams = {
        orderId: card.orderId,
        estimatedPayout: String(card.estimatedPayout),
        pickupLocation: card.pickupLocation,
        pickupBay: card.pickupBay || '',
        deliveryLocation: card.deliveryLocation,
        distance: card.distance,
        time: card.time,
        items: String(card.items),
      };

      const performNavigation = () => {
        router.push({
          pathname: '/accepted-order',
          params: navParams,
        });
      };

      try {
        await acceptOrder(orderId);
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        refetch();
        // Defer navigation until gesture/animation work is done so it reliably completes
        InteractionManager.runAfterInteractions(performNavigation);
      } catch (err) {
        console.error('Accept order failed:', err);
        // Navigate even on API failure so rider can retry or see details
        InteractionManager.runAfterInteractions(performNavigation);
      }
    },
    [ordersFromApi, router, refetch, queryClient]
  );

  const handleOrderPress = useCallback(
    (order: Order) => {
      const backendOrder = ordersFromApi.find((o) => o._id === order.orderId || o.orderNumber === order.orderId);
      if (!backendOrder) return;

      const status = (backendOrder.status || '').toLowerCase();
      const accepted = !!backendOrder.riderAssignment?.acceptedAt;

      // Unify the flow: Navigate to the correct step based on current status
      if (status === 'assigned' && accepted) {
        router.push({
          pathname: '/accepted-order',
          params: {
            orderId: order.orderId,
            estimatedPayout: order.estimatedPayout.toString(),
            pickupLocation: order.pickupLocation,
            pickupBay: order.pickupBay || '',
            deliveryLocation: order.deliveryLocation,
            distance: order.distance,
            time: order.time,
            items: order.items.toString(),
          },
        });
      } else if (status === 'picked') {
        router.push({
          pathname: '/verify-hub-items',
          params: {
            orderId: order.orderId,
            pickupLocation: order.pickupLocation,
            pickupBay: order.pickupBay || '',
            deliveryLocation: order.deliveryLocation,
            estimatedPayout: order.estimatedPayout.toString(),
            items: order.items.toString(),
          },
        });
      } else if (status === 'out_for_delivery') {
        router.push({
          pathname: '/handover-order',
          params: {
            orderId: order.orderId,
            customerName: backendOrder.customerPhoneNumber || 'Customer',
            customerAddress: order.deliveryLocation,
            estimatedPayout: order.estimatedPayout.toString(),
            items: order.items.toString(),
          },
        });
      } else {
        // Fallback for finished orders or other states (History view)
        router.push({
          pathname: '/order-details',
          params: {
            orderId: order.orderId,
            estimatedPayout: order.estimatedPayout.toString(),
            pickupLocation: order.pickupLocation,
            pickupBay: order.pickupBay || '',
            deliveryLocation: order.deliveryLocation,
            distance: order.distance,
            time: order.time,
            items: order.items.toString(),
          },
        });
      }
    },
    [router, ordersFromApi]
  );

  const hasOrders = availableOrders.length > 0 || activeOrders.length > 0 || previouslyAssignedOrders.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Live Orders"
        subtitle="Available and active orders assigned to you"
        showBackButton={false}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !ordersLoading}
            onRefresh={refetch}
            tintColor={Theme.colors.primaryMedium}
          />
        }
      >
        {!isOnShift ? (
          <View style={styles.emptyContainer}>
            <Text variant="body" color={Theme.colors.textGrey} style={styles.emptyText}>
              You’re currently not on shift.
            </Text>
            <Text variant="caption" color={Theme.colors.textLight} style={styles.emptySubtext}>
              Live orders are hidden when your shift is not active. Any uncompleted assignments will be treated as missed.
            </Text>
          </View>
        ) : ordersLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Theme.colors.primaryMedium} />
            <Text variant="caption" color={Theme.colors.textGrey} style={styles.loadingText}>
              Loading orders…
            </Text>
          </View>
        ) : ordersError ? (
          <View style={styles.errorContainer}>
            <Text variant="bodySm" color={Theme.colors.textGrey}>
              {ordersError instanceof Error ? ordersError.message : String(ordersError)}
            </Text>
          </View>
        ) : !hasOrders ? (
          <View style={styles.emptyContainer}>
            <Text variant="body" color={Theme.colors.textGrey} style={styles.emptyText}>
              No orders available right now.
            </Text>
            <Text variant="caption" color={Theme.colors.textLight} style={styles.emptySubtext}>
              New orders will appear here when assigned to you.
            </Text>
          </View>
        ) : (
          <>
            {availableOrders.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="h2" color={Theme.colors.textDark} style={styles.sectionTitle}>
                    Available to Accept
                  </Text>
                  <View style={styles.badge}>
                    <Text variant="caption" color={Theme.colors.primaryMedium} style={styles.badgeText}>
                      {availableOrders.length}
                    </Text>
                  </View>
                </View>
                <View style={styles.ordersList}>
                  {availableOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      mode="accept"
                      onSwipeAccept={handleOrderAccept}
                    />
                  ))}
                </View>
              </View>
            )}

            {activeOrders.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="h2" color={Theme.colors.textDark} style={styles.sectionTitle}>
                    Active Orders
                  </Text>
                  <View style={styles.badge}>
                    <Text variant="caption" color={Theme.colors.primaryMedium} style={styles.badgeText}>
                      {activeOrders.length}
                    </Text>
                  </View>
                </View>
                <View style={styles.ordersList}>
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      mode="view"
                      onPress={() => handleOrderPress(order)}
                    />
                  ))}
                </View>
              </View>
            )}

            {previouslyAssignedOrders.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="h2" color={Theme.colors.textDark} style={styles.sectionTitle}>
                    Previously Assigned
                  </Text>
                  <View style={styles.badge}>
                    <Text variant="caption" color={Theme.colors.textGrey} style={styles.badgeText}>
                      {previouslyAssignedOrders.length}
                    </Text>
                  </View>
                </View>
                <View style={styles.ordersList}>
                  {previouslyAssignedOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      mode="view"
                      onPress={() => handleOrderPress(order)}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: verticalScale(40),
  },
  loadingContainer: {
    paddingVertical: verticalScale(40),
    alignItems: 'center',
  },
  loadingText: {
    marginTop: scale(12),
  },
  errorContainer: {
    padding: scale(20),
  },
  emptyContainer: {
    paddingVertical: verticalScale(40),
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: scale(8),
    textAlign: 'center',
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: scale(17.5),
    fontWeight: '700',
  },
  badge: {
    paddingVertical: scale(2),
    paddingHorizontal: scale(8),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    borderRadius: scale(6),
  },
  badgeText: {
    fontSize: scale(11),
    fontWeight: '600',
  },
  ordersList: {
    gap: scale(12),
  },
});

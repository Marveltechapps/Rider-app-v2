/**
 * History Screen Component
 * Order history screen showing past deliveries with date selector and stats
 * Matches Figma design exactly
 */

import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/layout/Header';
import CalendarModal from '../components/CalendarModal';
import OrderCard, { Order } from '../components/OrderCard';
import Text from '../components/common/Text';
import CalendarIcon from '../components/icons/CalendarIcon';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import { listOrders, mapBackendOrderToHistoryOrder } from '../api/orders';
import { useConfigWithDefaults } from '../contexts';
import historyStyles from '../styles/historyStyles';
import { scale, verticalScale } from '../utils/responsive';

export default function HistoryScreen() {
  const router = useRouter();
  const config = useConfigWithDefaults();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const { data: ordersRes, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'history', 'delivered'],
    queryFn: () => listOrders({ status: 'delivered', limit: config.orderListLimit }),
    staleTime: 15 * 1000,
  });
  const apiOrders = useMemo(
    () => (ordersRes?.orders?.length ? ordersRes.orders.map(mapBackendOrderToHistoryOrder) : []),
    [ordersRes?.orders],
  );
  const ordersSource = apiOrders;

  // Filter orders by selected date
  const filteredOrders = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return ordersSource.filter(order => order.date === dateStr);
  }, [selectedDate, ordersSource]);

  // Calculate stats for selected date
  const stats = useMemo(() => {
    const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered');
    const totalOrders = deliveredOrders.length;
    const totalEarnings = deliveredOrders.reduce((sum, o) => sum + o.payout, 0);
    const ratingsCount = deliveredOrders.filter(o => o.rating).length;
    const avgRating = ratingsCount > 0
      ? (deliveredOrders.reduce((sum, o) => sum + (o.rating || 0), 0) / ratingsCount).toFixed(1)
      : '0.0';

    return {
      totalOrders,
      totalEarnings,
      avgRating,
    };
  }, [filteredOrders]);

  // Format date for display
  const formatDate = useCallback((date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'Today, ' + formatDateShort(date);
    } else if (isYesterday) {
      return 'Yesterday, ' + formatDateShort(date);
    } else {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return dayNames[date.getDay()] + ', ' + formatDateShort(date);
    }
  }, []);

  const formatDateShort = (date: Date): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handlePrevDay = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const handleNextDay = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const handleDatePress = useCallback(() => {
    setShowCalendarModal(true);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleOrderPress = useCallback((order: Order) => {
    router.push({
      pathname: '/order-details',
      params: { orderId: order.id },
    } as any);
  }, [router]);

  const renderOrder = useCallback(({ item }: { item: Order }) => (
    <OrderCard order={item} onPress={() => handleOrderPress(item)} />
  ), [handleOrderPress]);

  const renderEmptyList = useCallback(() => {
    if (ordersLoading) {
      return (
        <View style={{ paddingVertical: scale(40), alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#6A7282" />
          <Text variant="body" color="#6A7282" style={{ marginTop: scale(12) }}>
            Loading history…
          </Text>
        </View>
      );
    }
    return (
      <View style={{ paddingVertical: scale(40), alignItems: 'center' }}>
        <Text variant="body" color="#6A7282">
          No orders found for this date
        </Text>
      </View>
    );
  }, [ordersLoading]);

  const renderSeparator = useCallback(() => (
    <View style={{ height: verticalScale(14) }} />
  ), []);

  return (
    <SafeAreaView style={historyStyles.container} edges={['top']}>
      {/* Header */}
      <Header
        title="Order History"
        showBackButton={false}
      />

      <View style={historyStyles.header}>
        {/* Date Selector */}
        <View style={historyStyles.dateSelector}>
          <TouchableOpacity
            style={historyStyles.dateArrowButton}
            onPress={handlePrevDay}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={scale(18)} color="#6A7282" />
          </TouchableOpacity>

          <TouchableOpacity
            style={historyStyles.dateCenter}
            onPress={handleDatePress}
            activeOpacity={0.7}
          >
            <CalendarIcon size={scale(14)} color="#237227" />
            <Text variant="body" color="#101828" style={historyStyles.dateCenterText}>
              {formatDate(selectedDate)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={historyStyles.dateArrowButton}
            onPress={handleNextDay}
            activeOpacity={0.7}
          >
            <ChevronRightIcon size={scale(18)} color="#6A7282" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={historyStyles.statsRow}>
        <View style={historyStyles.statCard}>
          <Text variant="h3" color="#237227" style={historyStyles.statValue}>
            {stats.totalOrders}
          </Text>
          <Text variant="caption" color="#6A7282" style={historyStyles.statLabel}>
            Orders
          </Text>
        </View>
        <View style={historyStyles.statCard}>
          <Text variant="h3" color="#237227" style={historyStyles.statValue}>
            ₹{stats.totalEarnings}
          </Text>
          <Text variant="caption" color="#6A7282" style={historyStyles.statLabel}>
            Earned
          </Text>
        </View>
        <View style={historyStyles.statCard}>
          <Text variant="h3" color="#237227" style={historyStyles.statValue}>
            {stats.avgRating}
          </Text>
          <Text variant="caption" color="#6A7282" style={historyStyles.statLabel}>
            Avg Rating
          </Text>
        </View>
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={historyStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={renderSeparator}
      />

      {/* Bottom Tab Bar */}
      {/* Calendar Modal */}
      <CalendarModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onSelectDate={handleDateSelect}
        initialDate={selectedDate}
      />
    </SafeAreaView>
  );
}

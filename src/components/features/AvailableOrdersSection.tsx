/**
 * Available Orders Section Component
 * Section showing available orders with swipe to accept
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';
import Text from '../common/Text';
import OrderCard, { Order } from './OrderCard';

interface AvailableOrdersSectionProps {
  orders: Order[];
  onOrderAccept?: (orderId: string) => void;
}

export default function AvailableOrdersSection({
  orders,
  onOrderAccept,
}: AvailableOrdersSectionProps) {
  const nearbyCount = orders.length;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text variant="h2" color={Theme.colors.textDark} style={styles.title}>
          Available Orders
        </Text>
        {nearbyCount > 0 && (
          <View style={styles.badge}>
            <Text variant="caption" color={Theme.colors.primaryMedium} style={styles.badgeText}>
              {nearbyCount} Nearby
            </Text>
          </View>
        )}
      </View>

      {/* Orders List */}
      <View style={styles.ordersList}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onSwipeAccept={onOrderAccept}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: scale(14),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderGrey,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(17.5),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  badge: {
    paddingVertical: scale(1.75),
    paddingHorizontal: scale(7),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: scale(6.75),
  },
  badgeText: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  ordersList: {
    gap: scale(12),
  },
});


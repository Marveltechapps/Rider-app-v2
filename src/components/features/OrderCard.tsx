/**
 * Order Card Component
 * Individual order card with accept button to navigate to order details
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import Text from '../common/Text';
import DistanceIcon from '../icons/DistanceIcon';
import ItemsIcon from '../icons/ItemsIcon';
import TimeIcon from '../icons/TimeIcon';
import PrimaryActionButton from '../common/PrimaryActionButton';

export interface Order {
  id: string;
  // Backend identifier used for API calls and navigation.
  orderId: string;
  // Human-friendly order number (e.g. "63") shown to the rider.
  // Falls back to orderId when not provided.
  displayOrderNumber?: string;
  estimatedPayout: number;
  pickupLocation: string;
  pickupBay?: string;
  deliveryLocation: string;
  distance: string;
  time: string;
  items: number;
  isPriority?: boolean;
}

interface OrderCardProps {
  order: Order;
  mode?: 'accept' | 'view';
  onSwipeAccept?: (orderId: string) => void;
  onPress?: () => void;
}

export default function OrderCard({ order, mode = 'accept', onSwipeAccept, onPress }: OrderCardProps) {
  const router = useRouter();

  const handleButtonPress = useCallback(() => {
    if (mode === 'view' && onPress) {
      onPress();
      return;
    }
    if (mode === 'accept' && onSwipeAccept) {
      onSwipeAccept(order.orderId);
      return;
    }
    // Fallback: navigate to order details
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
  }, [router, order, mode, onPress, onSwipeAccept]);

  return (
    <View style={styles.card}>
      {/* Priority Badge */}
      {order.isPriority && (
        <View style={styles.priorityBadge}>
          <Text variant="caption" color={Theme.colors.white} style={styles.priorityText}>
            PRIORITY
          </Text>
        </View>
      )}

      {/* Top Section */}
      <View style={[styles.topSection, order.isPriority && styles.topSectionWithPriority]}>
        <View style={styles.payoutSection}>
          <Text variant="h3" color={Theme.colors.textDark} style={styles.payoutAmount}>
            ₹{order.estimatedPayout}
          </Text>
          <Text variant="caption" color={Theme.colors.textGrey} style={styles.payoutLabel}>
            Estimated Payout
          </Text>
        </View>
        <View style={styles.orderIdBadge}>
          <Text variant="caption" color={Theme.colors.textLabel} style={styles.orderIdText}>
            {order.displayOrderNumber ?? order.orderId}
          </Text>
        </View>
      </View>

      {/* Route Section */}
      <View style={styles.routeSection}>
        {/* Route Line */}
        <View style={styles.routeLine}>
          <View style={styles.routeDot} />
          <View style={styles.routeLineMiddle} />
          <View style={[styles.routeDot, styles.routeDotRed]} />
        </View>

        {/* Locations */}
        <View style={styles.locationsContainer}>
          {/* Pickup */}
          <View style={styles.locationSection}>
            <Text variant="caption" color={Theme.colors.textGrey} style={styles.locationLabel}>
              PICKUP
            </Text>
            <Text variant="bodySm" color={Theme.colors.textDark} style={styles.locationName}>
              {order.pickupLocation}
            </Text>
            {order.pickupBay && (
              <Text variant="caption" color={Theme.colors.textGrey} style={styles.locationDetail}>
                {order.pickupBay}
              </Text>
            )}
          </View>

          {/* Delivery */}
          <View style={styles.locationSection}>
            <Text variant="caption" color={Theme.colors.textGrey} style={styles.locationLabel}>
              DELIVER
            </Text>
            <Text variant="bodySm" color={Theme.colors.textDark} style={styles.locationName}>
              {order.deliveryLocation}
            </Text>
          </View>
        </View>
      </View>

      {/* Info Badges */}
      <View style={styles.infoBadges}>
        <View style={styles.infoBadge}>
          <DistanceIcon size={scale(10.5)} color={Theme.colors.textLabel} />
          <Text variant="caption" color={Theme.colors.textLabel} style={styles.infoBadgeText}>
            {order.distance}
          </Text>
        </View>
        <View style={styles.infoBadge}>
          <TimeIcon size={scale(10.5)} color={Theme.colors.textLabel} />
          <Text variant="caption" color={Theme.colors.textLabel} style={styles.infoBadgeText}>
            {order.time}
          </Text>
        </View>
        <View style={styles.infoBadge}>
          <ItemsIcon size={scale(10.5)} color={Theme.colors.textLabel} />
          <Text variant="caption" color={Theme.colors.textLabel} style={styles.infoBadgeText}>
            {order.items} items
          </Text>
        </View>
      </View>

      <PrimaryActionButton
        label={mode === 'accept' ? 'Accept Order' : 'View Details'}
        onPress={handleButtonPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    padding: scale(15),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    position: 'relative',
    ...Theme.shadows.small,
  },
  priorityBadge: {
    position: 'absolute',
    top: scale(0.88),
    right: scale(0),
    backgroundColor: '#FB2C36',
    borderTopRightRadius: scale(8),
    borderBottomLeftRadius: scale(6),
    paddingVertical: scale(2),
    paddingHorizontal: scale(4),
    zIndex: 2,
    minWidth: scale(50), // Ensure minimum width to prevent overlap
  },
  priorityText: {
    fontSize: scale(10),
    lineHeight: scale(16),
    fontWeight: '700',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(14),
  },
  topSectionWithPriority: {
    paddingTop: scale(20), // Add padding when priority badge exists to push content below badge
  },
  payoutSection: {
    gap: scale(0),
    flex: 1,
  },
  payoutAmount: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  payoutLabel: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  orderIdBadge: {
    paddingVertical: scale(3.5),
    paddingHorizontal: scale(7),
    backgroundColor: Theme.colors.gray100,
    borderRadius: scale(3.5),
    marginLeft: scale(8),
  },
  orderIdText: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  routeSection: {
    flexDirection: 'row',
    gap: scale(10.5),
    marginBottom: scale(14),
  },
  routeLine: {
    width: scale(7),
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: scale(70),
  },
  routeDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(3.5),
    backgroundColor: Theme.colors.primaryMedium,
  },
  routeDotRed: {
    backgroundColor: '#FB2C36',
  },
  routeLineMiddle: {
    width: scale(1.75),
    height: scale(49),
    backgroundColor: Theme.colors.borderGrey,
    marginVertical: scale(3.5),
  },
  locationsContainer: {
    flex: 1,
    gap: scale(14),
  },
  locationSection: {
    gap: scale(0),
  },
  locationLabel: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  locationName: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
  locationDetail: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  infoBadges: {
    flexDirection: 'row',
    gap: scale(7),
    marginBottom: scale(14),
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingVertical: scale(4),
    paddingHorizontal: scale(7),
    backgroundColor: Theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(3.5),
    flex: 1,
  },
  infoBadgeText: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  acceptButton: {
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(9999),
    height: scale(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(7),
    ...Theme.shadows.buttonPrimary,
  },
  acceptButtonText: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
});


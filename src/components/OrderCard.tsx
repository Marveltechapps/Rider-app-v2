/**
 * Order Card Component
 * Displays order history information in a card format
 * Matches Figma design exactly
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from './common/Text';
import PackageIcon from './icons/PackageIcon';
import StoreMarkerIcon from './icons/StoreMarkerIcon';
import LocationPinIcon from './icons/LocationPinIcon';
import DistanceIcon from './icons/DistanceIcon';
import ItemsIcon from './icons/ItemsIcon';
import historyStyles from '../styles/historyStyles';
import { scale } from '../utils/responsive';

export type OrderStatus = 'delivered' | 'cancelled' | 'returned';

export interface Order {
  id: string;             // e.g. "ORD240012"
  date: string;           // ISO date, e.g. "2025-12-02"
  time: string;           // e.g. "3:45 PM"
  durationMins: number;   // e.g. 18
  storeName: string;      // "Fresh Mart Supermarket"
  area: string;           // "HSR Layout Sector 2"
  distanceKm: number;     // e.g. 2.3
  itemsCount: number;     // e.g. 8
  payout: number;         // e.g. 65 (for ₹65)
  rating?: number;        // optional, 1–5
  status: OrderStatus;
}

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <TouchableOpacity 
      style={historyStyles.orderCard} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Header: Icon, Order ID, Time, Payout, Duration */}
      <View style={historyStyles.orderCardHeader}>
        <View style={historyStyles.orderCardLeft}>
          {/* Package Icon */}
          <View style={historyStyles.orderIconContainer}>
            <PackageIcon size={scale(18)} color="#FFFFFF" />
          </View>

          {/* Order ID and Time */}
          <View style={historyStyles.orderInfo}>
            <View style={historyStyles.orderIdRow}>
              <Text variant="body" color="#101828" style={historyStyles.orderId} numberOfLines={1}>
                {order.id}
              </Text>
            </View>
            <Text variant="bodySm" color="#6A7282" style={historyStyles.orderTime}>
              {order.time}
            </Text>
          </View>
        </View>

        {/* Payout and Duration */}
        <View style={historyStyles.orderCardRight}>
          <Text variant="body" color="#32C96A" style={historyStyles.orderPayout}>
            ₹{order.payout}
          </Text>
          <Text variant="caption" color="#6B7280" style={historyStyles.orderDuration}>
            {order.durationMins} mins
          </Text>
        </View>
      </View>

      {/* Details: Store, Area, Distance, Items */}
      <View style={historyStyles.orderDetails}>
        {/* Store Name */}
        <View style={historyStyles.orderDetailRow}>
          <View style={historyStyles.orderDetailIconContainer}>
            <StoreMarkerIcon size={scale(7)} color="#32C96A" />
          </View>
          <Text variant="bodySm" color="#4A5565" style={historyStyles.orderDetailText}>
            {order.storeName}
          </Text>
        </View>

        {/* Area */}
        <View style={historyStyles.orderDetailRow}>
          <LocationPinIcon size={scale(21)} color="#32C96A" />
          <Text variant="bodySm" color="#4A5565" style={historyStyles.orderDetailText}>
            {order.area}
          </Text>
        </View>

        {/* Distance and Items */}
        <View style={historyStyles.orderMetaRow}>
          <View style={historyStyles.orderMetaItem}>
            <DistanceIcon size={scale(12.25)} color="#6B7280" />
            <Text variant="caption" color="#6B7280" style={historyStyles.orderMetaText}>
              {order.distanceKm} km
            </Text>
          </View>
          <View style={historyStyles.orderMetaItem}>
            <ItemsIcon size={scale(12.25)} color="#6B7280" />
            <Text variant="caption" color="#6B7280" style={historyStyles.orderMetaText}>
              {order.itemsCount} items
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}


/**
 * Cash History Item Component
 * Individual transaction item in the cash history list
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import Text from '../common/Text';
import CashCollectedIcon from '../icons/CashCollectedIcon';
import CashDepositedIcon from '../icons/CashDepositedIcon';
import ClockIcon from '../icons/ClockIcon';

export interface CashTransaction {
  id: string;
  type: 'collected' | 'deposited';
  title: string;
  amount: number;
  dateTime: string;
  orderId?: string;
  referenceId?: string;
  status?: 'SUCCESS' | 'PENDING' | 'FAILED';
}

interface CashHistoryItemProps {
  transaction: CashTransaction;
  onPress?: () => void;
}

export default function CashHistoryItem({ transaction, onPress }: CashHistoryItemProps) {
  const isCollected = transaction.type === 'collected';
  const amountColor = isCollected ? '#F54900' : '#32C96A';
  const amountPrefix = isCollected ? '+' : '-';
  const formattedAmount = `${amountPrefix} ₹${transaction.amount.toLocaleString('en-IN')}`;
  const iconBgColor = isCollected ? '#FFF7ED' : '#F0FDF4';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Left Icon */}
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          {isCollected ? (
            <CashCollectedIcon size={scale(17.5)} color="#F54900" />
          ) : (
            <CashDepositedIcon size={scale(17.5)} color="#32C96A" />
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text variant="bodySm" color={Theme.colors.textDark} style={styles.title}>
            {transaction.title}
          </Text>
          <View style={styles.subtitleRow}>
            <ClockIcon size={scale(10.5)} color={Theme.colors.textGrey} />
            <Text variant="caption" color={Theme.colors.textGrey} style={styles.subtitle}>
              {transaction.dateTime}
            </Text>
          </View>
          {transaction.orderId && (
            <Text variant="caption" color={Theme.colors.textGrey} style={styles.orderId}>
              {transaction.orderId}
            </Text>
          )}
        </View>

        {/* Right Amount */}
        <View style={styles.amountContainer}>
          <Text variant="body" color={amountColor} style={styles.amount}>
            {formattedAmount}
          </Text>
          {transaction.status === 'SUCCESS' && (
            <View style={styles.statusBadge}>
              <Text variant="caption" color="#32C96A" style={styles.statusText}>
                SUCCESS
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: scale(8),
    padding: scale(16),
    paddingHorizontal: scale(12),
    borderWidth: 1,
    borderColor: Theme.colors.borderGrey,
    ...Theme.shadows.small,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
  },
  iconContainer: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    gap: scale(2),
  },
  title: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  subtitle: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  orderId: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
    fontFamily: 'Consolas',
  },
  amountContainer: {
    alignItems: 'flex-end',
    gap: scale(4),
  },
  amount: {
    fontSize: scale(14),
    lineHeight: scale(21),
    fontWeight: '700',
  },
  statusBadge: {
    paddingVertical: scale(2),
    paddingHorizontal: scale(4),
    backgroundColor: 'rgba(50, 201, 106, 0.1)',
    borderWidth: 1,
    borderColor: '#32C96A',
    borderRadius: scale(4),
  },
  statusText: {
    fontSize: scale(10),
    lineHeight: scale(15),
    fontWeight: '700',
  },
});


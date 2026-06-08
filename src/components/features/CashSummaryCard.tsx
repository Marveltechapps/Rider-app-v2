/**
 * Cash Summary Card Component
 * Black card showing cash to be deposited, limit, and deposit button
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';
import Button from '../common/Button';
import Text from '../common/Text';
import WalletStackIcon from '../icons/WalletStackIcon';
import WarningIcon from '../icons/WarningIcon';

interface CashSummaryCardProps {
  cashToDeposit: number;
  limit: number;
  onDepositPress: () => void;
}

export default function CashSummaryCard({
  cashToDeposit,
  limit,
  onDepositPress,
}: CashSummaryCardProps) {
  const limitUsed = Math.min((cashToDeposit / limit) * 100, 100);
  const exceedsLimit = cashToDeposit > limit;
  
  // Format amount exactly as in Figma: ₹450 or ₹2,450
  const formattedAmount = `₹${cashToDeposit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const formattedLimit = `₹${limit.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Limit`;

  // Progress bar color: green when under limit, red when over limit
  const progressBarColor = exceedsLimit ? '#FB2C36' : '#237227';
  // Button color: green when under limit, red when over limit
  const buttonColor = exceedsLimit ? '#FB2C36' : '#237227';

  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.labelContainer}>
          <Text variant="bodySm" color="#6B7280" style={styles.label}>
            Cash to be Deposited
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <WalletStackIcon size={scale(17.5)} color="#237227" />
        </View>
      </View>

      {/* Amount */}
      <Text variant="h1" color={Theme.colors.white} style={styles.amount}>
        {formattedAmount}
      </Text>

      {/* Limit Section */}
      <View style={styles.limitSection}>
        <View style={styles.limitRow}>
          <Text variant="caption" color="#6B7280" style={styles.limitLabel}>
            Limit Used
          </Text>
          <Text variant="caption" color="#6B7280" style={styles.limitValue}>
            {formattedLimit}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${limitUsed}%`, backgroundColor: progressBarColor }]} />
        </View>

        {/* Warning Message - Only show when exceeds limit */}
        {exceedsLimit && (
          <View style={styles.warningRow}>
            <WarningIcon size={scale(10.5)} color="#FF6467" />
            <Text variant="caption" color="#FF6467" style={styles.warningText}>
              Deposit immediately to receive orders
            </Text>
          </View>
        )}
      </View>

      {/* Deposit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.depositButton, { backgroundColor: buttonColor }]}
          onPress={onDepositPress}
          activeOpacity={0.8}
        >
          <Text variant="bodySm" color={Theme.colors.white} style={styles.buttonText}>
            Deposit Cash
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111111',
    borderRadius: scale(8),
    padding: scale(20),
    paddingHorizontal: scale(16),
    gap: scale(12),
    ...Theme.shadows.large,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '400',
  },
  iconContainer: {
    width: scale(31.5),
    height: scale(31.5),
    backgroundColor: 'rgba(35, 114, 39, 0.2)',
    borderRadius: scale(8.75),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(7),
  },
  amount: {
    fontSize: scale(31.5),
    lineHeight: scale(35),
    fontWeight: '700',
  },
  limitSection: {
    gap: scale(7),
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitLabel: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  limitValue: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  progressBarContainer: {
    height: scale(7),
    backgroundColor: '#1E2939',
    borderRadius: scale(9999),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: scale(9999),
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  warningText: {
    fontSize: scale(10),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  buttonContainer: {
    paddingTop: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#1E2939',
  },
  depositButton: {
    borderRadius: scale(12.75),
    paddingVertical: scale(7),
    paddingHorizontal: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
});


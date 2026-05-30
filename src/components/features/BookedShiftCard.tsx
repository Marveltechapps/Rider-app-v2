/**
 * Booked Shift Card Component
 * Individual booked shift card with booked status badge
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import Text from '../common/Text';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import CupIcon from '../icons/CupIcon';
import FlameIcon from '../icons/FlameIcon';
import LightningIcon from '../icons/LightningIcon';
import { Shift } from './ShiftCard';

interface BookedShiftCardProps {
  shift: Shift;
  onCancel?: () => void;
}

export default function BookedShiftCard({ shift, onCancel }: BookedShiftCardProps) {
  const timeRange = `${shift.startTime} - ${shift.endTime}`;
  const durationText = `${shift.durationHours} Hour Shift`;
  const dateText = shift.date ? new Date(shift.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }) : '';

  return (
    <View style={styles.card}>
      {/* Peak Time Badge - Overlapping on top */}
      {shift.isPeakTime && (
        <View style={styles.peakTimeBadge}>
          <FlameIcon size={scale(10.5)} color="#FFFFFF" />
          <Text variant="caption" color={Theme.colors.white} style={styles.peakTimeText}>
            PEAK TIME
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.leftSection}>
          {/* Time Range */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3" color={Theme.colors.textDark} style={styles.timeRange}>
              {timeRange}
            </Text>
            {dateText && (
              <Text variant="bodySm" color={Theme.colors.textGrey} style={{ fontWeight: '600' }}>
                {dateText}
              </Text>
            )}
          </View>
          {shift.hubName ? (
            <Text variant="bodySm" color={Theme.colors.textGrey} style={{ fontWeight: '600' }}>
              {shift.hubName}
            </Text>
          ) : null}

          {/* Badges Row */}
          <View style={styles.badgesRow}>
            {/* Duration Badge */}
            <View style={styles.durationBadge}>
              <Text variant="caption" color={Theme.colors.textLabel} style={styles.badgeText}>
                {durationText}
              </Text>
            </View>

            {/* Break Badge */}
            {shift.hasBreak && (
              <View style={styles.breakBadge}>
                <CupIcon size={scale(10.5)} color={Theme.colors.textGrey} />
                <Text variant="caption" color={Theme.colors.textGrey} style={styles.badgeText}>
                  {shift.breakMinutes ?? 10} min break
                </Text>
              </View>
            )}

            {/* Base Pay Badge */}
            {(shift.basePay ?? 0) > 0 && (
              <View style={styles.durationBadge}>
                <Text variant="caption" color={Theme.colors.textLabel} style={styles.badgeText}>
                  ₹{shift.basePay} Base
                </Text>
              </View>
            )}
          </View>

          {/* Incentive Banner */}
          {shift.hasIncentive && typeof shift.incentiveAmount === 'number' && shift.incentiveAmount > 0 && (
            <View style={styles.incentiveBanner}>
              <LightningIcon size={scale(10.5)} color={Theme.colors.primaryMedium} />
              <Text variant="bodySm" color={Theme.colors.primaryMedium} style={styles.incentiveText}>
                Extra ₹{shift.incentiveAmount} on this slot!
              </Text>
            </View>
          )}

          {onCancel && (
            <View style={{ marginTop: scale(10), flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={onCancel}
                activeOpacity={0.8}
                style={styles.cancelButton}
              >
                <Text variant="caption" color={Theme.colors.white} style={styles.cancelButtonText}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Booked Badge - Small badge at bottom */}
      <View style={styles.bookedBadge}>
        <CheckCircleIcon size={scale(8)} color="#32C96A" />
        <Text variant="caption" color="#32C96A" style={styles.bookedText}>
          BOOKED
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(50, 201, 106, 0.05)', // Lighter green background
    borderRadius: scale(8),
    padding: scale(16),
    paddingBottom: scale(28), // Extra padding at bottom for booked badge
    marginBottom: scale(16),
    borderWidth: 1,
    borderColor: Theme.colors.primaryMedium, // App theme green color
    position: 'relative',
  },
  bookedBadge: {
    position: 'absolute',
    bottom: scale(8),
    right: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(3),
  },
  bookedText: {
    fontSize: scale(9),
    lineHeight: scale(13),
    fontWeight: '700',
    color: '#32C96A',
  },
  peakTimeBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Theme.colors.primaryMedium,
    borderTopRightRadius: scale(8),
    borderBottomLeftRadius: scale(12.75),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(7),
    paddingVertical: scale(4),
    zIndex: 2, // Higher zIndex to overlap on top
  },
  peakTimeText: {
    fontSize: scale(10),
    lineHeight: scale(15),
    fontWeight: '700',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: scale(16),
  },
  leftSection: {
    flex: 1,
    gap: scale(11),
  },
  timeRange: {
    fontSize: scale(15.75),
    lineHeight: scale(24.5),
    fontWeight: '700',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7),
    flexWrap: 'wrap',
  },
  durationBadge: {
    paddingVertical: scale(1.75),
    paddingHorizontal: scale(7),
    borderWidth: 1,
    borderColor: `rgba(50, 201, 106, 0.3)`, // Subtle app theme green
    borderRadius: scale(8),
  },
  breakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingVertical: scale(1),
    paddingHorizontal: scale(6),
    backgroundColor: Theme.colors.gray100,
    borderRadius: scale(8),
  },
  badgeText: {
    fontSize: scale(10.5),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  incentiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7),
    paddingVertical: scale(7),
    paddingLeft: scale(7),
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 0.6,
    borderColor: `rgba(50, 201, 106, 0.4)`, // Subtle app theme green
    borderRadius: scale(8),
  },
  incentiveText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: Theme.colors.error,
    paddingHorizontal: scale(12),
    paddingVertical: scale(7),
    borderRadius: scale(8),
  },
  cancelButtonText: {
    fontSize: scale(10),
    lineHeight: scale(14),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});

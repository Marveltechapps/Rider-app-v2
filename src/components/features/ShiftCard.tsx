/**
 * Shift Card Component
 * Individual shift card with selection, peak time badge, and incentive banner
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import Text from '../common/Text';
import CupIcon from '../icons/CupIcon';
import FlameIcon from '../icons/FlameIcon';
import LightningIcon from '../icons/LightningIcon';
import RadioIcon from '../icons/RadioIcon';

export interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hasBreak: boolean;
  isPeakTime: boolean;
  hasIncentive: boolean;
  incentiveAmount?: number;
  basePay?: number;
  breakMinutes?: number;
  date?: string;
  hubName?: string;
  bookedCount?: number;
  capacity?: number;
}

interface ShiftCardProps {
  shift: Shift;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function ShiftCard({ shift, selected, onPress, disabled }: ShiftCardProps) {
  const timeRange = `${shift.startTime} - ${shift.endTime}`;
  const durationText = `${shift.durationHours} Hour Shift`;
  const isFull = (shift.bookedCount ?? 0) >= (shift.capacity ?? 999);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.cardSelected,
        isFull && styles.cardFull,
        disabled && styles.cardDisabled
      ]}
      onPress={isFull || disabled ? undefined : onPress}
      activeOpacity={isFull || disabled ? 1 : 0.7}
    >
      {/* Peak Time Badge */}
      {shift.isPeakTime && (
        <View style={[
          styles.peakTimeBadge,
          isFull && styles.peakTimeBadgeFull,
          disabled && styles.peakTimeBadgeBooked
        ]}>
          <FlameIcon size={scale(10.5)} color="#FFFFFF" />
          <Text variant="caption" color={Theme.colors.white} style={styles.peakTimeText}>
            {disabled ? 'BOOKED' : isFull ? 'FULLY BOOKED' : 'PEAK TIME'}
          </Text>
        </View>
      )}

      {/* Full Status Badge (if not peak time) */}
      {!shift.isPeakTime && (isFull || disabled) && (
        <View style={[styles.fullBadge, disabled && styles.bookedBadge]}>
          <Text variant="caption" color={Theme.colors.white} style={styles.peakTimeText}>
            {disabled ? 'BOOKED' : 'FULLY BOOKED'}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.leftSection}>
          {/* Time Range */}
          <Text variant="h3" color={isFull || disabled ? Theme.colors.textGrey : Theme.colors.textDark} style={styles.timeRange}>
            {timeRange}
          </Text>
          {shift.hubName ? (
            <Text variant="bodySm" color={Theme.colors.textGrey} style={styles.hubName}>
              {shift.hubName}
            </Text>
          ) : null}

          {/* Badges Row */}
          <View style={styles.badgesRow}>
            {/* Booking Count Badge */}
            <View style={[styles.durationBadge, isFull && styles.bookingBadgeFull]}>
              <Text variant="caption" color={isFull ? Theme.colors.error : Theme.colors.textLabel} style={[styles.badgeText, isFull && { fontWeight: '700' }]}>
                {shift.bookedCount ?? 0}/{shift.capacity ?? 0} Booked
              </Text>
            </View>

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
        </View>

        {/* Radio Button */}
        <View style={styles.radioContainer}>
          <RadioIcon
            size={scale(21)}
            selected={selected || disabled}
            color={Theme.colors.gray200}
            selectedColor={disabled ? Theme.colors.success : Theme.colors.primaryMedium}
          />
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
    paddingRight: scale(12),
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: scale(16),
    position: 'relative',
    ...Theme.shadows.small,
  },
  cardSelected: {
    borderColor: Theme.colors.primaryMedium,
    shadowColor: Theme.colors.primaryMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  cardFull: {
    backgroundColor: Theme.colors.gray50,
    opacity: 0.8,
  },
  cardDisabled: {
    opacity: 0.5,
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
    zIndex: 1,
  },
  peakTimeBadgeFull: {
    backgroundColor: Theme.colors.textGrey,
  },
  peakTimeBadgeBooked: {
    backgroundColor: Theme.colors.success,
  },
  fullBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Theme.colors.textGrey,
    borderTopRightRadius: scale(8),
    borderBottomLeftRadius: scale(12.75),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(7),
    paddingVertical: scale(4),
    zIndex: 1,
  },
  bookedBadge: {
    backgroundColor: Theme.colors.success,
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
  hubName: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '600',
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
    borderColor: Theme.colors.borderGrey,
    borderRadius: scale(4),
  },
  bookingBadgeFull: {
    borderColor: Theme.colors.error,
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
  },
  breakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingVertical: scale(1),
    paddingHorizontal: scale(6),
    backgroundColor: Theme.colors.gray100,
    borderRadius: scale(4),
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
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(35, 114, 39, 0.2)',
    borderRadius: scale(8),
  },
  incentiveText: {
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    fontWeight: '700',
  },
  radioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(20)
  },
});

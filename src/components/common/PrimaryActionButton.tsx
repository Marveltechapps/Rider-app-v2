/**
 * Full-width primary action button (replaces swipe-to-accept controls).
 */

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Text from './Text';
import { Theme } from '../../constants/Theme';
import { scale, verticalScale } from '../../utils/responsive';

export interface PrimaryActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function PrimaryActionButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}: PrimaryActionButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={Theme.colors.white} />
      ) : (
        <Text variant="body" color={Theme.colors.white} style={styles.label}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: scale(48),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: Theme.colors.primaryMedium,
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '700',
    textAlign: 'center',
  },
});

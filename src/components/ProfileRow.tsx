/**
 * Profile Row Component
 * Reusable row component for profile settings/options
 */

import React, { ReactNode } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { scale } from '../utils/responsive';
import Text from './common/Text';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ProfileRowProps {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  rightBadge?: ReactNode;
  style?: ViewStyle;
  /** Red label for destructive actions (e.g. delete account) */
  destructive?: boolean;
}

export default function ProfileRow({
  icon,
  label,
  onPress,
  rightBadge,
  style,
  destructive,
}: ProfileRowProps) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'stretch',
          paddingVertical: scale(12),
          paddingHorizontal: scale(16),
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#F3F4F6',
          borderRadius: scale(8),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={`Navigate to ${label}`}
    >
      {/* Left: Icon + Label */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: scale(8),
          flex: 1,
          height: scale(42),
        }}
      >
        {icon}
        <Text
          variant="body"
          color={destructive ? '#B91C1C' : '#101828'}
          style={{
            fontSize: scale(14),
            fontWeight: '600',
            lineHeight: scale(21),
          }}
        >
          {label}
        </Text>
      </View>

      {/* Right: Badge + Chevron */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: scale(8),
        }}
      >
        {rightBadge}
        <ChevronRightIcon size={scale(17.5)} color="#4A5565" />
      </View>
    </TouchableOpacity>
  );
}


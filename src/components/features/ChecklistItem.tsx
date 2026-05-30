/**
 * Checklist Item Component
 * Reusable checklist item with icon, checkbox, and label
 * 
 * @component
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import Text from '../common/Text';
import CheckboxIcon from '../icons/CheckboxIcon';
import CheckboxCheckedGreenIcon from '../icons/CheckboxCheckedGreenIcon';

interface ChecklistItemProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function ChecklistItem({
  icon,
  label,
  checked,
  onToggle,
  disabled = false,
  style,
}: ChecklistItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container, 
        checked && styles.containerChecked,
        disabled && styles.containerDisabled,
        style
      ]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`${label}, ${checked ? 'checked' : 'unchecked'}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      {checked ? (
        <CheckboxCheckedGreenIcon size={24} />
      ) : (
        <CheckboxIcon size={24} checked={false} />
      )}
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text variant="loginInfo" color="#364153" style={styles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10.5), // Figma: gap: 10.5px
    padding: scale(12),
    backgroundColor: Theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: scale(8),
  },
  containerChecked: {
    backgroundColor: '#F5FCF8', // Exact Figma checked background
    borderColor: '#BBEDCD', // Exact Figma checked border
  },
  containerDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: scale(12.25),
    lineHeight: scale(17.5),
    color: '#364153',
  },
});


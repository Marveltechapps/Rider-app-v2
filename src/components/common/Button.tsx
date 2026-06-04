/**
 * Button Component
 * Foundation button component with variants and states
 * 
 * @component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Theme } from '../../constants/Theme';
import { scale } from '../../utils/responsive';
import Text from './Text';
import AppPressable from './AppPressable';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  style,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <AppPressable
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      minTouchSize={scale(48)}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Theme.colors.white : Theme.colors.primary} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            variant="body"
            color={variant === 'primary' ? Theme.colors.white : Theme.colors.primary}
            style={styles.buttonText}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Theme.colors.primaryMedium,
    ...Theme.shadows.medium,
  },
  secondary: {
    backgroundColor: Theme.colors.gray200,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  small: {
    height: scale(40),
    paddingHorizontal: Theme.spacing.md,
  },
  medium: {
    height: scale(49),
    paddingHorizontal: Theme.spacing.lg,
  },
  large: {
    height: scale(56),
    paddingHorizontal: Theme.spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: scale(15.75),
  },
  iconLeft: {
    marginRight: Theme.spacing.sm,
  },
  iconRight: {
    marginLeft: Theme.spacing.sm,
  },
});


/**
 * Pressable with minimum 44pt touch target and immediate press feedback.
 */

import React, { ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

const DEFAULT_HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

export type AppPressableProps = PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  minTouchSize?: number;
};

export default function AppPressable({
  children,
  style,
  hitSlop = DEFAULT_HIT_SLOP,
  minTouchSize = 44,
  disabled,
  ...rest
}: AppPressableProps) {
  return (
    <Pressable
      hitSlop={hitSlop}
      disabled={disabled}
      delayPressIn={0}
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
      style={({ pressed }) => [
        {
          minWidth: minTouchSize,
          minHeight: minTouchSize,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: pressed ? 0.65 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

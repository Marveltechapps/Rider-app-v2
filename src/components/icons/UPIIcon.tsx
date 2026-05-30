/**
 * UPI Icon Component
 * For UPI payment method
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface UPIIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function UPIIcon({
  size = 24,
  color = '#32C96A',
  style,
}: UPIIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      style={style}
    >
      <Circle
        cx="12.5"
        cy="12.5"
        r="12"
        fill={color}
        opacity="0.1"
      />
      <Path
        d="M12.5 6.25L6.25 10.42V14.58L12.5 18.75L18.75 14.58V10.42L12.5 6.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.5 12.5L8.33 10.42"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.5 12.5L16.67 10.42"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


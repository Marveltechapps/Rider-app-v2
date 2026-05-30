/**
 * Lightning Bolt Icon Component
 * For badge on app icon
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface LightningIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function LightningIcon({
  size = 16,
  color = '#32C96A',
  style,
}: LightningIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 18"
      style={style}
    >
      <Path
        d="M2.62 1.75 L15.38 1.75 L8.62 8.5 L13.38 8.5 L2.62 17.5 L6.38 10.75 L1.62 10.75 L2.62 1.75 Z"
        fill={color}
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


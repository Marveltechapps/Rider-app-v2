/**
 * Arrow Up Right Icon Component
 * For UPI payment method card
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ArrowUpRightIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ArrowUpRightIcon({
  size = 8,
  color = '#32C96A',
  style,
}: ArrowUpRightIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="none"
      style={style}
    >
      <Path
        d="M5.1 1.46H1.46V5.1"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.46 1.46L6.39 6.39"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


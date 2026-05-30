/**
 * Arrow Left Icon Component
 * For back navigation
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ArrowLeftIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ArrowLeftIcon({
  size = 10,
  color = '#6B7280',
  style,
}: ArrowLeftIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      style={style}
    >
      <Path
        d="M7 2.63 L2.63 5.25 L7 8.37"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


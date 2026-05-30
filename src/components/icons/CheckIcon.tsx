/**
 * Check Icon Component
 * Used for checkbox checked state
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CheckIcon({
  size = 21,
  color = '#32C96A',
  style,
}: CheckIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      style={style}
    >
      <Path
        d="M7.875 10.5L9.625 12.25L13.125 8.75"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


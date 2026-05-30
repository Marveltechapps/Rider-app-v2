/**
 * Checkmark Icon Component
 * Large checkmark icon for success states
 * Based on Figma design
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckmarkIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CheckmarkIcon({
  size = 42,
  color = '#FFFFFF',
  style,
}: CheckmarkIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      style={style}
    >
      {/* Checkmark path - based on Figma coordinates */}
      <Path
        d="M7 22.125L15.75 30.875L35 11.125"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


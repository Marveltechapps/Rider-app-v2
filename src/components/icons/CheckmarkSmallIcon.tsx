/**
 * Small Checkmark Icon Component
 * Small checkmark icon for success cards
 * Based on Figma design
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckmarkSmallIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CheckmarkSmallIcon({
  size = 18,
  color = '#00A63E',
  style,
}: CheckmarkSmallIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 17.5 17.5"
      style={style}
    >
      {/* Checkmark path */}
      <Path
        d="M1.46 8.75L6.56 13.85L16.04 4.37"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


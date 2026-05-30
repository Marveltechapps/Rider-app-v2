/**
 * Time Icon Component
 * For order time display
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface TimeIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function TimeIcon({
  size = 10,
  color = '#4A5565',
  style,
}: TimeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      fill="none"
      style={style}
    >
      <Circle
        cx="5.25"
        cy="5.25"
        r="4.38"
        stroke={color}
        strokeWidth="0.875"
      />
      <Path
        d="M5.25 2.63V5.25L7.88 7.88"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
    </Svg>
  );
}


/**
 * Check Circle Icon Component
 * Green check icon for validation
 * Downloaded from Figma node-id: 13454:469
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckCircleIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CheckCircleIcon({
  size = 18,
  color = '#32C96A',
  style,
}: CheckCircleIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      style={style}
    >
      <Circle
        cx="9"
        cy="9"
        r="7.5"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M6.75 8.99999L8.25 10.5L11.25 7.49999"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


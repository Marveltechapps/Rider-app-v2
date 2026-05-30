/**
 * Loading Spinner Icon Component
 * Circular loading indicator for verification process
 */

import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface LoadingSpinnerIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function LoadingSpinnerIcon({
  size = 68.28,
  color = '#32C96A',
  style,
}: LoadingSpinnerIconProps) {
  const scaleFactor = size / 84; // Scale from 84x84 viewBox to desired size
  
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 84 84"
      style={style}
    >
      {/* Inner circle with stroke (the main spinner) */}
      <Circle
        cx="42"
        cy="42"
        r="25.605"
        stroke={color}
        strokeWidth="4.074"
        fill="none"
        strokeDasharray="80"
        strokeDashoffset="20"
        strokeLinecap="round"
      />
    </Svg>
  );
}


/**
 * Use Location Icon Component
 * Small location pin icon for "Use my location" button
 * Downloaded from Figma node-id: 13454:222
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface UseLocationIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function UseLocationIcon({
  size = 11,
  color = '#32C96A',
  style,
}: UseLocationIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      style={style}
    >
      <Path
        d="M1.375 5.04167L10.0833 0.916667L5.95833 9.625L5.04167 5.95833L1.375 5.04167Z"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


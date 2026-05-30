/**
 * Back Icon Small Component
 * Small back navigation icon (28x28px) from Figma design
 * Used in headers - just the arrow without circle background
 * Downloaded from Figma node-id: 13454:135
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface BackIconSmallProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function BackIconSmall({
  size = 28,
  color = '#101828',
  style,
}: BackIconSmallProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      style={style}
    >
      {/* Arrow left chevron - matches Figma exactly */}
      <Path
        d="M14 19.1042L8.89581 14L14 8.89583"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow horizontal line - matches Figma exactly */}
      <Path
        d="M19.1041 14H8.89581"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


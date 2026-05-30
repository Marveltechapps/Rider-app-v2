/**
 * Back Icon Component
 * Back navigation icon from Figma design
 * Exact match to Figma: 42x42px white circle with border and arrow
 * Downloaded from Figma node-id: 13454:7
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface BackIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function BackIcon({
  size = 42,
  style,
}: BackIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={style}
    >
      {/* White circle background with border - matches Figma exactly */}
      <Circle
        cx="24"
        cy="24"
        r="21"
        fill="#FFFFFF"
        stroke="#E5E7EB"
        strokeWidth="1"
      />
      {/* Arrow left chevron - matches Figma path exactly */}
      <Path
        d="M24 28.1042L18.8958 23L24 17.8958"
        stroke="#101828"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow horizontal line - matches Figma path exactly */}
      <Path
        d="M29.1042 23H18.8958"
        stroke="#101828"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

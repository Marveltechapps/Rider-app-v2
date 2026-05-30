/**
 * Parcel/Box Icon Component
 * 3D parcel outline icon for app icon
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ParcelIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ParcelIcon({
  size = 48,
  color = '#FFFFFF',
  style,
}: ParcelIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={style}
    >
      <G stroke={color} strokeWidth="5.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Box outline - front face */}
        <Path d="M10 16 L10 32 L24 40 L38 32 L38 16 L24 8 Z" />
        {/* Top face */}
        <Path d="M10 16 L24 8 L38 16" />
        {/* Right side */}
        <Path d="M38 16 L38 32" />
        {/* Vertical divider */}
        <Path d="M24 8 L24 40" />
        {/* Horizontal divider */}
        <Path d="M10 16 L38 16" />
      </G>
    </Svg>
  );
}


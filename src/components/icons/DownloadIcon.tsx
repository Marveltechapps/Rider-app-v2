/**
 * Download Icon Component
 * Icon for cash out button
 * Based on Figma design
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface DownloadIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function DownloadIcon({
  size = 14,
  color = '#FFFFFF',
  style,
}: DownloadIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      style={style}
    >
      {/* Horizontal line at top (shorter, representing surface/file) */}
      <Path
        d="M4 2H10"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Vertical line from top to arrow */}
      <Path
        d="M7 2V9.5"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Downward pointing arrow */}
      <Path
        d="M4.5 7.5L7 10L9.5 7.5"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


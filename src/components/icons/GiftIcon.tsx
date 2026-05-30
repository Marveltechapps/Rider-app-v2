/**
 * Gift Icon Component
 * Icon for active incentives section
 * Based on Figma design
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface GiftIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function GiftIcon({
  size = 18,
  color = '#32C96A',
  style,
}: GiftIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      {/* Gift box icon */}
      <Path
        d="M2.19 5.83H15.31V8.75H2.19V5.83Z"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.75 5.83V15.31"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.65 8.75H5.25C7.44 8.75 7.44 2.19 5.25 2.19H3.65"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.85 8.75H12.25C10.06 8.75 10.06 2.19 12.25 2.19H13.85"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


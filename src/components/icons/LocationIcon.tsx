/**
 * Location Icon Component
 * Location pin icon from Figma design
 * Downloaded from Figma node-id: 13454:46
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface LocationIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function LocationIcon({
  size = 18,
  color = '#237227',
  style,
}: LocationIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      style={style}
    >
      <Path
        d="M2.25 8.24999L16.5 1.49999L9.75 15.75L8.25 9.74999L2.25 8.24999Z"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


/**
 * Info Icon Component
 * For info cards and hints
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface InfoIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function InfoIcon({
  size = 18,
  color = '#155DFC',
  style,
}: InfoIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      <Path
        d="M1.46 4.38H14.58V8.75H1.46V4.38Z"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.29 7.29H9.21V9.21H7.29V7.29Z"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
      />
      <Path
        d="M4.38 8.75H9.21V13.13H4.38V8.75Z"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

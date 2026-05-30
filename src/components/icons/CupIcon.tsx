/**
 * Cup Icon Component
 * For break time indicator
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CupIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CupIcon({
  size = 10,
  color = '#6A7282',
  style,
}: CupIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      fill="none"
      style={style}
    >
      <Path
        d="M2.19 3.5H8.31M2.19 3.5L1.31 0.88H9.69L8.31 3.5M2.19 3.5L1.31 7.29H8.69L7.31 3.5"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.63 0.88H8.13"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
      <Path
        d="M1.31 7.29L2.63 0.88"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
    </Svg>
  );
}


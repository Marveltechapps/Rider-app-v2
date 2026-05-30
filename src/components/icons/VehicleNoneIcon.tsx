/**
 * Vehicle None Icon Component
 * No vehicle icon for "I don't have a vehicle" option
 * Downloaded from Figma node-id: 13454:458
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface VehicleNoneIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function VehicleNoneIcon({
  size = 21,
  color = '#99A1AF',
  style,
}: VehicleNoneIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      style={style}
    >
      <Path
        d="M4.31299 4.31287L16.6864 16.6871"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle
        cx="10.5"
        cy="10.5"
        r="8.75"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


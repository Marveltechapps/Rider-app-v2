/**
 * Vehicle Icon Component
 * Car/vehicle icon for RC and insurance
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface VehicleIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function VehicleIcon({ 
  size = 24, 
  color = '#6A7282',
  style 
}: VehicleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M5 13L3 13C2.44772 13 2 13.4477 2 14V17C2 17.5523 2.44772 18 3 18H5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M19 13H21C21.5523 13 22 13.4477 22 14V17C22 17.5523 21.5523 18 21 18H19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M5 18V19C5 19.5523 5.44772 20 6 20H7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M17 20H18C18.5523 20 19 19.5523 19 19V18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M5 13L6 8H18L19 13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 8L7 5H17L18 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="7.5" cy="15.5" r="1.5" fill={color} />
      <Circle cx="16.5" cy="15.5" r="1.5" fill={color} />
    </Svg>
  );
}


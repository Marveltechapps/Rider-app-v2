/**
 * License Icon Component
 * Driving license icon
 */

import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface LicenseIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function LicenseIcon({ 
  size = 24, 
  color = '#6A7282',
  style 
}: LicenseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Rect 
        x="2" 
        y="5" 
        width="20" 
        height="14" 
        rx="2" 
        stroke={color} 
        strokeWidth="1.5"
      />
      <Circle cx="7" cy="12" r="2.5" stroke={color} strokeWidth="1.5" />
      <Path
        d="M13 10H19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M13 14H17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}


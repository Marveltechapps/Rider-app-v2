/**
 * ID Card Icon Component
 * ID card icon for Aadhar/PAN
 */

import React from 'react';
import Svg, { Rect, Line, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface IdCardIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function IdCardIcon({ 
  size = 24, 
  color = '#6A7282',
  style 
}: IdCardIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Rect 
        x="3" 
        y="6" 
        width="18" 
        height="12" 
        rx="2" 
        stroke={color} 
        strokeWidth="1.5"
      />
      <Circle cx="8" cy="12" r="2" stroke={color} strokeWidth="1.5" />
      <Line x1="13" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="13" y1="14" x2="16" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

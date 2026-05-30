/**
 * Email Icon Component
 * Email/mail icon
 */

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface EmailIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function EmailIcon({ 
  size = 18, 
  color = '#32C96A',
  style 
}: EmailIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Rect 
        x="1.5" 
        y="4.5" 
        width="15" 
        height="10.5" 
        rx="2" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <Path
        d="M1.5 6.75L9 11.25L16.5 6.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


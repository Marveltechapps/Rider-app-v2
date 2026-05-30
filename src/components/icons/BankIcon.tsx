/**
 * Bank Icon Component
 * Bank/building icon
 */

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface BankIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function BankIcon({ 
  size = 18, 
  color = '#6A7282',
  style 
}: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Path
        d="M1.5 6.75L9 2.25L16.5 6.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 15.75V8.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M7.5 15.75V8.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M10.5 15.75V8.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M15 15.75V8.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Rect
        x="1.5"
        y="15"
        width="15"
        height="1.5"
        fill={color}
      />
    </Svg>
  );
}


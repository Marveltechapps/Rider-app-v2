/**
 * Star Icon Component
 * Rating star icon
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface StarIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
  style?: ViewStyle;
}

export default function StarIcon({ 
  size = 14, 
  color = '#FFB800',
  filled = true,
  style 
}: StarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
      <Path
        d="M7 1L8.854 5.146L13 6.708L9.5 9.854L10.708 14L7 11.646L3.292 14L4.5 9.854L1 6.708L5.146 5.146L7 1Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


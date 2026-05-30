/**
 * Chevron Left Icon Component
 * Used for navigation arrows
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ChevronLeftIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ChevronLeftIcon({ 
  size = 18, 
  color = '#6A7282',
  style 
}: ChevronLeftIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Path
        d="M10.94 4.38L6.56 8.75L10.94 13.13"
        stroke={color}
        strokeWidth={1.458}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


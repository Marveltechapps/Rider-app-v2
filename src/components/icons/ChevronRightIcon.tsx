/**
 * Chevron Right Icon Component
 * Used for navigation arrows
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ChevronRightIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ChevronRightIcon({ 
  size = 18, 
  color = '#6A7282',
  style 
}: ChevronRightIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={style}>
      <Path
        d="M7.06 13.13L11.44 8.75L7.06 4.38"
        stroke={color}
        strokeWidth={1.458}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


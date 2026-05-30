/**
 * Shield Check Icon Component
 * Shield with checkmark for document status
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ShieldCheckIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ShieldCheckIcon({ 
  size = 24, 
  color = '#FFFFFF',
  style 
}: ShieldCheckIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12L11 14L15 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


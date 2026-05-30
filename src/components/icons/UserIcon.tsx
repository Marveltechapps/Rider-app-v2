/**
 * User Icon Component
 * User avatar icon for profile
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface UserIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function UserIcon({ 
  size = 24, 
  color = '#32C96A',
  style 
}: UserIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path
        d="M6 20C6 17.2386 8.68629 15 12 15C15.3137 15 18 17.2386 18 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}


import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CloseIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CloseIcon({ 
  size = 24, 
  color = '#4C4C4C',
  style,
}: CloseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M18 6L6 18M6 6L18 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

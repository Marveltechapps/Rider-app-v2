/**
 * Calendar Icon Component
 * Used in date selector
 */

import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CalendarIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CalendarIcon({ 
  size = 14, 
  color = '#237227',
  style 
}: CalendarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
      <Line x1="4.67" y1="1.17" x2="4.67" y2="3.5" stroke={color} strokeWidth={1.167} strokeLinecap="round" />
      <Line x1="9.33" y1="1.17" x2="9.33" y2="3.5" stroke={color} strokeWidth={1.167} strokeLinecap="round" />
      <Path
        d="M1.75 2.33H12.25V12.83H1.75V2.33Z"
        stroke={color}
        strokeWidth={1.167}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Line x1="1.75" y1="5.83" x2="12.25" y2="5.83" stroke={color} strokeWidth={1.167} />
    </Svg>
  );
}

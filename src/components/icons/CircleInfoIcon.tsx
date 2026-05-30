/**
 * Circle Info Icon Component
 * Circle with exclamation mark for info boxes
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CircleInfoIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CircleInfoIcon({
  size = 18,
  color = '#155DFC',
  style,
}: CircleInfoIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      {/* Circle */}
      <Circle
        cx="9"
        cy="9"
        r="7.5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Exclamation mark - top part (vertical line) */}
      <Path
        d="M9 5.5 L9 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Exclamation mark - bottom part (dot) */}
      <Circle
        cx="9"
        cy="12"
        r="0.75"
        fill={color}
      />
    </Svg>
  );
}


import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ClockIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ClockIcon({
  size = 10,
  color = '#237227',
  style,
}: ClockIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 10.5 10.5"
      fill="none"
      style={style}
    >
      <Circle cx="5.25" cy="5.25" r="4.375" stroke={color} strokeWidth="0.875" />
      <Path d="M5.25 2.63V5.25L7 7" stroke={color} strokeWidth="0.875" strokeLinecap="round" />
    </Svg>
  );
}


import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface BoxIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function BoxIcon({
  size = 28,
  color = '#2B7FFF',
  style,
}: BoxIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      style={style}
    >
      <Path
        d="M1.75 1.17L14 7L26.25 1.17M1.75 1.17L14 7M1.75 1.17V10.5L14 16.33M14 7V16.33M14 7L26.25 1.17M26.25 1.17V10.5L14 16.33M14 16.33L1.75 10.5M14 16.33L26.25 10.5"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 3.5V7M21 3.5V7"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
      />
    </Svg>
  );
}


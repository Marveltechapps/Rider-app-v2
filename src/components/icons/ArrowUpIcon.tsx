import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ArrowUpIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ArrowUpIcon({
  size = 3.5,
  color = '#32C96A',
  style,
}: ArrowUpIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 3.5 3.5"
      fill="none"
      style={style}
    >
      <Path
        d="M1.75 0.88L3.5 2.63L1.75 4.38"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.75 0.88L1.75 2.63"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
    </Svg>
  );
}


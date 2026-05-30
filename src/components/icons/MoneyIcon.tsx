import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface MoneyIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function MoneyIcon({
  size = 28,
  color = '#E7000B',
  style,
}: MoneyIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      style={style}
    >
      <Circle cx="14" cy="14" r="11.67" stroke={color} strokeWidth="2.33333" />
      <Path
        d="M11.67 7V11.67M16.33 7V11.67M11.67 11.67H16.33M11.67 11.67V14M16.33 11.67V14M11.67 14H16.33M11.67 14V16.33M16.33 14V16.33M11.67 16.33H16.33"
        stroke={color}
        strokeWidth="2.33333"
        strokeLinecap="round"
      />
      <Path d="M7 14H21" stroke={color} strokeWidth="2.33333" strokeLinecap="round" />
    </Svg>
  );
}


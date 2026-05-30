/**
 * Right Arrow Icon Component
 * Used for bottom button arrow
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface RightArrowIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function RightArrowIcon({
  size = 21,
  color = '#FFFFFF',
  style,
}: RightArrowIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      style={style}
    >
      <Path
        d="M7.875 5.25L13.125 10.5L7.875 15.75"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


/**
 * Search Icon Component
 * Search icon for search input fields
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface SearchIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function SearchIcon({
  size = 18,
  color = '#99A1AF',
  style,
}: SearchIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      style={style}
    >
      <Circle
        cx="8"
        cy="8"
        r="5.5"
        stroke={color}
        strokeWidth="1.45833"
        fill="none"
      />
      <Path
        d="M13 13L15.5 15.5"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}


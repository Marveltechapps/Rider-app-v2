/**
 * Flame Icon Component
 * For peak time badge
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface FlameIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function FlameIcon({
  size = 10,
  color = '#FFFFFF',
  style,
}: FlameIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      fill="none"
      style={style}
    >
      <Path
        d="M5.5 0.5C5.5 0.5 3.5 2.5 3.5 5.5C3.5 7.5 4.5 9 5.5 9.5C6.5 9 7.5 7.5 7.5 5.5C7.5 2.5 5.5 0.5 5.5 0.5Z"
        fill={color}
      />
    </Svg>
  );
}


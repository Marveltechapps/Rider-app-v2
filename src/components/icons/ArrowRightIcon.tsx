/**
 * Arrow Right Icon Component
 * For buttons and navigation
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ArrowRightIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ArrowRightIcon({
  size = 14,
  color = '#FFFFFF',
  style,
}: ArrowRightIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      style={style}
    >
      <Path
        d="M2.91675 7H11.0834"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M7 2.91669L11.0833 7.00002L7 11.0834"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


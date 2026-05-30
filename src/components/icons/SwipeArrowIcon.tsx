/**
 * Swipe Arrow Icon Component
 * For swipe to accept button
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface SwipeArrowIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function SwipeArrowIcon({
  size = 18,
  color = '#0A0A0A',
  style,
}: SwipeArrowIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      <Path
        d="M6.56 4.38L10.94 8.75L6.56 13.13"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M-3.5 8.75H10.94"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
      />
    </Svg>
  );
}


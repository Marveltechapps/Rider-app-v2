/**
 * Large white checkmark for success states (inside green circle)
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckmarkLargeWhiteIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CheckmarkLargeWhiteIcon({
  size = 48,
  color = '#FFFFFF',
  style,
}: CheckmarkLargeWhiteIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M5 12.5L9.5 17L19 7"
        stroke={color}
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

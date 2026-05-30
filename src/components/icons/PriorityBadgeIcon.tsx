/**
 * Priority Badge Icon Component
 * For priority order badge
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface PriorityBadgeIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function PriorityBadgeIcon({
  size = 10,
  color = '#FFFFFF',
  style,
}: PriorityBadgeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      fill="none"
      style={style}
    >
      <Path
        d="M5.25 0.88L10.5 3.5L5.25 6.13L0 3.5L5.25 0.88Z"
        fill={color}
      />
      <Path
        d="M5.25 6.13L10.5 8.75L5.25 11.38L0 8.75L5.25 6.13Z"
        fill={color}
      />
    </Svg>
  );
}


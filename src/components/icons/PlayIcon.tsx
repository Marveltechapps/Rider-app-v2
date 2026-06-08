/**
 * Play Icon Component
 * Play button icon for video player
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface PlayIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function PlayIcon({
  size = 18,
  color = '#237227',
  style,
}: PlayIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 17.5 17.5"
      style={style}
    >
      <Path
        d="M3.65 2.19L13.32 8.75L3.65 15.31V2.19Z"
        fill={color}
      />
    </Svg>
  );
}


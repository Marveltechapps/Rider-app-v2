/**
 * Chat Icon Component
 * Icon for chat/message button
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ChatIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ChatIcon({
  size = 28,
  color = '#FFFFFF',
  style,
}: ChatIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      style={style}
    >
      {/* Chat bubble */}
      <Path
        d="M7 4C5.34315 4 4 5.34315 4 7V15C4 16.6569 5.34315 18 7 18H9.5L12 21.5L14.5 18H21C22.6569 18 24 16.6569 24 15V7C24 5.34315 22.6569 4 21 4H7Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Chat dots */}
      <Path
        d="M10 11H10.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11H14.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 11H18.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}



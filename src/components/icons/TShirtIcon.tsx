/**
 * T-Shirt Icon Component
 * Icon for T-Shirt item in kit checklist
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface TShirtIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function TShirtIcon({
  size = 28,
  color = '#4A5565',
  style,
}: TShirtIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      style={style}
    >
      <Path
        d="M7 8.75H21V21C21 21.5304 20.7893 22.0391 20.4142 22.4142C20.0391 22.7893 19.5304 23 19 23H9C8.46957 23 7.96086 22.7893 7.58579 22.4142C7.21071 22.0391 7 21.5304 7 21V8.75Z"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M10.5 8.75V5.25C10.5 4.85218 10.658 4.47064 10.9393 4.18934C11.2206 3.90804 11.6022 3.75 12 3.75H16C16.3978 3.75 16.7794 3.90804 17.0607 4.18934C17.342 4.47064 17.5 4.85218 17.5 5.25V8.75"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M7 8.75L12 3.75L17 8.75"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


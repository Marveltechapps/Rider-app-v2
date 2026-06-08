/**
 * Dispatch Bay Icon Component
 * Icon for dispatch bay badge
 * From Figma node 13506:2256
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface DispatchBayIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function DispatchBayIcon({
  size = 14,
  color = '#237227',
  style,
}: DispatchBayIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      style={style}
    >
      <Path
        d="M1.75 4.08333V2.91667C1.75 2.60725 1.87292 2.3105 2.09171 2.09171C2.3105 1.87292 2.60725 1.75 2.91667 1.75H4.08333"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.91699 1.75H11.0837C11.3931 1.75 11.6898 1.87292 11.9086 2.09171C12.1274 2.3105 12.2503 2.60725 12.2503 2.91667V4.08333"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.2503 9.91666V11.0833C12.2503 11.3927 12.1274 11.6895 11.9086 11.9083C11.6898 12.1271 11.3931 12.25 11.0837 12.25H9.91699"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.08333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3927 1.75 11.0833V9.91666"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.08301 7H9.91634"
        stroke={color}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


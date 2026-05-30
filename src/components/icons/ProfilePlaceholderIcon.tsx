/**
 * Profile Placeholder Icon Component
 * User silhouette icon for profile photo placeholder
 * Downloaded from Figma node-id: 13456:506
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ProfilePlaceholderIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ProfilePlaceholderIcon({
  size = 112,
  color = 'rgba(255, 255, 255, 0.4)',
  style,
}: ProfilePlaceholderIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
    >
      <Path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle
        cx="12"
        cy="7"
        r="4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


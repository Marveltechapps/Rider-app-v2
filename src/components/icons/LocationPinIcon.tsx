/**
 * Location Pin Icon Component
 * Used for area/location in order history
 * Exact SVG from Figma
 */

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface LocationPinIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function LocationPinIcon({ 
  size = 21, 
  color = '#32C96A',
  style 
}: LocationPinIconProps) {
  const scale = size / 21; // Scale factor for different sizes
  
  return (
    <Svg width={size} height={size} viewBox="0 0 21 21" fill="none" style={style}>
      <Rect width="21" height="21" rx="8.75" fill={color} fillOpacity="0.1" />
      <Path
        d="M14 9.625C14 11.8094 11.5767 14.0844 10.7629 14.7871C10.6871 14.8441 10.5948 14.8749 10.5 14.8749C10.4052 14.8749 10.3129 14.8441 10.2371 14.7871C9.42331 14.0844 7 11.8094 7 9.625C7 8.69674 7.36875 7.8065 8.02513 7.15013C8.6815 6.49375 9.57174 6.125 10.5 6.125C11.4283 6.125 12.3185 6.49375 12.9749 7.15013C13.6313 7.8065 14 8.69674 14 9.625Z"
        fill={color}
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.5 10.9375C11.2249 10.9375 11.8125 10.3499 11.8125 9.625C11.8125 8.90013 11.2249 8.3125 10.5 8.3125C9.77513 8.3125 9.1875 8.90013 9.1875 9.625C9.1875 10.3499 9.77513 10.9375 10.5 10.9375Z"
        fill={color}
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


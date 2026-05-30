/**
 * Store Marker Icon Component
 * Small green dot icon for store location
 */

import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface StoreMarkerIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function StoreMarkerIcon({ 
  size = 7, 
  color = '#32C96A',
  style 
}: StoreMarkerIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 7 7" fill="none" style={style}>
      <Circle cx="3.5" cy="3.5" r="3.5" fill={color} />
    </Svg>
  );
}


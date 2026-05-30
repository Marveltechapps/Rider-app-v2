/**
 * Camera Shutter Icon Component
 * Circular camera shutter button icon
 * Downloaded from Figma node-id: 13456:511
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CameraShutterIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function CameraShutterIcon({
  size = 56,
  style,
}: CameraShutterIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      style={style}
    >
      <Circle
        cx="28"
        cy="28"
        r="28"
        stroke="#FFFFFF"
        strokeWidth="4"
        fill="none"
      />
      <Circle
        cx="28"
        cy="28"
        r="21"
        fill="#FFFFFF"
      />
    </Svg>
  );
}


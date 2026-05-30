/**
 * Radio Icon Component
 * Radio button for shift selection
 */

import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface RadioIconProps {
  size?: number;
  selected?: boolean;
  color?: string;
  selectedColor?: string;
  style?: ViewStyle;
}

export default function RadioIcon({
  size = 21,
  selected = false,
  color = '#F3F4F6',
  selectedColor = '#32C96A',
  style,
}: RadioIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      style={style}
    >
      <Circle
        cx="10.5"
        cy="10.5"
        r="10"
        fill={selected ? selectedColor : 'transparent'}
        stroke={selected ? selectedColor : color}
        strokeWidth={selected ? 0 : 2}
      />
      {selected && (
        <Circle
          cx="10.5"
          cy="10.5"
          r="4.375"
          fill="#FFFFFF"
        />
      )}
    </Svg>
  );
}


/**
 * Checkbox Icon Component
 * Checkbox icon for checklist items (checked/unchecked states)
 */

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckboxIconProps {
  size?: number;
  checked?: boolean;
  style?: ViewStyle;
}

export default function CheckboxIcon({
  size = 14,
  checked = false,
  style,
}: CheckboxIconProps) {
  if (checked) {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        style={style}
      >
        <Rect
          x="0.5"
          y="0.5"
          width="13"
          height="13"
          rx="1"
          fill="#237227"
          stroke="#237227"
          strokeWidth="1"
        />
        <Path
          d="M3.5 7L6 9.5L10.5 5"
          stroke="#FFFFFF"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    );
  }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      style={style}
    >
      <Rect
        x="0.5"
        y="0.5"
        width="13"
        height="13"
        rx="1"
        fill="#F3F3F5"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth="1"
      />
    </Svg>
  );
}


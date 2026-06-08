/**
 * Checkbox Checked Green Icon Component
 * Exact icon from Figma for checked checklist items
 * Downloaded from assets/icons/checkbox-checked-green.svg
 */

/**
 * Checkbox Checked Green Icon Component
 * Exact icon from Figma for checked checklist items
 * Downloaded from assets/icons/checkbox-checked-green.svg
 * Simplified for react-native-svg compatibility
 */

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckboxCheckedGreenIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function CheckboxCheckedGreenIcon({
  size = 14,
  style,
}: CheckboxCheckedGreenIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      {/* Rounded rectangle background */}
      <Rect
        x="2"
        y="2"
        width="14"
        height="14"
        rx="4"
        fill="#237227"
      />
      {/* Checkmark */}
      <Path
        d="M13 5.125L7.5 10.625L5 8.125"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


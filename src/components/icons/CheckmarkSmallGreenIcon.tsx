/**
 * Small Green Checkmark Icon Component
 * Exact icon from Figma for status pill
 * Downloaded from assets/icons/checkmark-small-green.svg
 */

import React from 'react';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckmarkSmallGreenIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function CheckmarkSmallGreenIcon({
  size = 10,
  style,
}: CheckmarkSmallGreenIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      fill="none"
      style={style}
    >
      <G clipPath="url(#clip0_13476_96)">
        <Path
          d="M5.5 10.0833C8.03131 10.0833 10.0833 8.03131 10.0833 5.5C10.0833 2.96869 8.03131 0.916667 5.5 0.916667C2.96869 0.916667 0.916667 2.96869 0.916667 5.5C0.916667 8.03131 2.96869 10.0833 5.5 10.0833Z"
          stroke="#32C96A"
          strokeWidth="0.875"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4.125 5.5L5.04167 6.41667L6.875 4.58333"
          stroke="#32C96A"
          strokeWidth="0.875"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_13476_96">
          <Rect width="10.5" height="10.5" fill="white" transform="scale(1.04762)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}


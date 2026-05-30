/**
 * Arrow Right White Icon Component
 * Exact icon from Figma for button
 * Downloaded from assets/icons/arrow-right-white.svg
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ArrowRightWhiteIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function ArrowRightWhiteIcon({
  size = 14,
  style,
}: ArrowRightWhiteIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      style={style}
    >
      <Path
        d="M2.92 7H11.08"
        stroke="#FFFFFF"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 2.92L11.08 7L7 11.08"
        stroke="#FFFFFF"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


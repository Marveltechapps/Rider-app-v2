/**
 * Large White Checkmark Icon Component
 * Exact icon from Figma for training complete state
 * Downloaded from assets/icons/checkmark-large-white.svg
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CheckmarkLargeWhiteIconProps {
  size?: number;
  style?: ViewStyle;
}

export default function CheckmarkLargeWhiteIcon({
  size = 42,
  style,
}: CheckmarkLargeWhiteIconProps) {
  const scaleFactor = size / 42;
  return (
    <Svg
      width={size}
      height={size * (35 / 42)}
      viewBox="0 0 42 35"
      fill="none"
      style={style}
    >
      <Path
        d="M21 32.0833C30.665 32.0833 38.5 25.5542 38.5 17.5C38.5 9.44585 30.665 2.91667 21 2.91667C11.335 2.91667 3.5 9.44585 3.5 17.5C3.5 25.5542 11.335 32.0833 21 32.0833Z"
        stroke="#32C96A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M15.75 17.5L19.25 20.4167L26.25 14.5833"
        stroke="#32C96A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}


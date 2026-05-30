/**
 * Cash Icon Component
 * Icon for cash collected button
 */

import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CashIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CashIcon({
  size = 14,
  color = '#FFFFFF',
  style,
}: CashIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      style={style}
    >
      <G clipPath="url(#clip0_13520_2817)">
        <Path
          d="M11.667 3.5H2.33366C1.68933 3.5 1.16699 4.02233 1.16699 4.66667V9.33333C1.16699 9.97767 1.68933 10.5 2.33366 10.5H11.667C12.3113 10.5 12.8337 9.97767 12.8337 9.33333V4.66667C12.8337 4.02233 12.3113 3.5 11.667 3.5Z"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M6.99967 8.16668C7.64401 8.16668 8.16634 7.64434 8.16634 7.00001C8.16634 6.35568 7.64401 5.83334 6.99967 5.83334C6.35534 5.83334 5.83301 6.35568 5.83301 7.00001C5.83301 7.64434 6.35534 8.16668 6.99967 8.16668Z"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M3.5 7H3.50583M10.5 7H10.5058"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_13520_2817">
          <Rect width="14" height="14" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}


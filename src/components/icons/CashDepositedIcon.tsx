/**
 * Cash Deposited Icon Component
 * For cash deposited transactions (checkmark)
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CashDepositedIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CashDepositedIcon({
  size = 18,
  color = '#32C96A',
  style,
}: CashDepositedIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      <Path
        d="M5.25 8.75L7.88 11.38L12.75 6.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 1.75C13.1421 1.75 16.5 5.10786 16.5 9.25C16.5 13.3921 13.1421 16.75 9 16.75C4.85786 16.75 1.5 13.3921 1.5 9.25C1.5 5.10786 4.85786 1.75 9 1.75Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


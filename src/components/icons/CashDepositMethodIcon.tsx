/**
 * Cash Deposit Method Icon Component
 * For cash deposit payment method
 */

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CashDepositMethodIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CashDepositMethodIcon({
  size = 24,
  color = '#6B7280',
  style,
}: CashDepositMethodIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      style={style}
    >
      <Rect
        x="3"
        y="6"
        width="19"
        height="13"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M3 10H22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M8 14H17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M8 17H14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}


/**
 * Cash Collected Icon Component
 * For cash collected transactions
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface CashCollectedIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function CashCollectedIcon({
  size = 18,
  color = '#F54900',
  style,
}: CashCollectedIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      <Path
        d="M1.75 5.25H16.25V10.5H1.75V5.25Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.75 8.75H9.25V10.5H8.75V8.75Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <Path
        d="M5.25 10.5H10.5V12.25H5.25V10.5Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


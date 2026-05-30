/**
 * Rupee Icon Component
 * Icon for currency/amount display
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface RupeeIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function RupeeIcon({
  size = 18,
  color = '#101828',
  style,
}: RupeeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      <Path
        d="M4.5 2.25H13.5"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.5 6.00001H13.5"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.5 9.74999L10.875 15.75"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.5 9.74999H6.75"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.75 9.75C11.7502 9.75 11.7502 2.25 6.75 2.25"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

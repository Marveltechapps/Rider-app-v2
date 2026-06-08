/**
 * Wallet Stack Icon Component
 * For cash summary card
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface WalletStackIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function WalletStackIcon({
  size = 18,
  color = '#237227',
  style,
}: WalletStackIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      <Path
        d="M2.19 2.19H15.81V9.48H2.19V2.19Z"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.19 2.19H15.81V3.65H2.19V2.19Z"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.85 9.48V15.81H2.19V9.48"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.85 11.67H17.5V13.13H13.85V11.67Z"
        stroke={color}
        strokeWidth="1.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


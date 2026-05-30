/**
 * Warning Icon Component
 * For cash limit warning
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface WarningIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function WarningIcon({
  size = 10,
  color = '#FF6467',
  style,
}: WarningIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      fill="none"
      style={style}
    >
      <Path
        d="M0.88 1.31L5.5 0.88L10.12 1.31L8.76 7.88L5.5 10.5L2.24 7.88L0.88 1.31Z"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.25 3.94V7.44"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
      <Path
        d="M5.25 8.75H5.25"
        stroke={color}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
    </Svg>
  );
}


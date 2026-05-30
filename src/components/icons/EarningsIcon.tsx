import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

interface EarningsIconProps {
  size?: number;
  color?: string;
  active?: boolean;
  style?: ViewStyle;
}

export default function EarningsIcon({
  size = 21,
  color,
  active = false,
  style,
}: EarningsIconProps) {
  const iconColor = color || (active ? Theme.colors.white : Theme.colors.textLight);
  
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      fill="none"
      style={style}
    >
      <Path
        d="M24.5 16.625H29.75V21.875"
        stroke={iconColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M29.75 16.625L22.3125 24.0625L17.9375 19.6875L12.25 25.375"
        stroke={iconColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


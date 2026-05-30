import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

interface HistoryIconProps {
  size?: number;
  color?: string;
  active?: boolean;
  style?: ViewStyle;
}

export default function HistoryIcon({
  size = 21,
  color,
  active = false,
  style,
}: HistoryIconProps) {
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
        d="M21 15.75V21L24.5 22.75"
        stroke={iconColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 29.75C25.8325 29.75 29.75 25.8325 29.75 21C29.75 16.1675 25.8325 12.25 21 12.25C16.1675 12.25 12.25 16.1675 12.25 21C12.25 25.8325 16.1675 29.75 21 29.75Z"
        stroke={iconColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


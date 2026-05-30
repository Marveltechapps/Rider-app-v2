/**
 * Back Arrow Icon Component
 * Exact icon from Figma for header back button
 * Downloaded from assets/icons/back-arrow-icon.svg
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface BackArrowIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function BackArrowIcon({
  size = 28,
  color = '#101828',
  style,
}: BackArrowIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      style={style}
    >
      <Path
        d="M14.0002 19.1042L8.896 14L14.0002 8.89583"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.1043 14H8.896"
        stroke={color}
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


/**
 * Logout Icon Component
 * Logout/exit icon
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface LogoutIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function LogoutIcon({ 
  size = 14, 
  color = '#E7000B',
  style 
}: LogoutIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
      <Path
        d="M5.25 12.25H2.625C2.42609 12.25 2.23532 12.171 2.09467 12.0303C1.95402 11.8897 1.875 11.6989 1.875 11.5V2.5C1.875 2.30109 1.95402 2.11032 2.09467 1.96967C2.23532 1.82902 2.42609 1.75 2.625 1.75H5.25"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.625 9.625L12.25 7L9.625 4.375"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.25 7H5.25"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

